# Store active sessions
from threading import Lock
from typing import Dict

import orjson
import requests

from common.core.config import settings
from common.error import SingleMessageError
from common.utils.utils import SQLBotLogUtil

active_sessions: Dict[str, str] = {}
sessions_lock = Lock()

class NL2SQLSession:
    @classmethod
    def _get_session(cls, ds_name: str, ds_type: str, user_id: str) -> str:
        with sessions_lock:
            if user_id not in active_sessions:
                session_id = cls._create_session(ds_name, ds_type, user_id)
                active_sessions[user_id] = session_id
            return active_sessions[user_id]

    @classmethod
    def _create_session(cls, ds_name: str, ds_type: str, user_id: str) -> str:
        if not settings.EXTERNAL_SQL_GENERATION_SERVICE_URL:
            raise SingleMessageError("External SQL generation service is not configured.")
        SQLBotLogUtil.info(
            f"Calling external SQL generation service to create a session: {settings.EXTERNAL_SQL_GENERATION_SERVICE_URL}")
        try:
            # 准备请求体
            request_data = {
                "db_id": ds_name,  # 使用数据源名称作为 db_id
                "db_type": ds_type,  # 使用数据源类型作为 db_type
                "db_env": settings.EXTERNAL_SQL_GENERATION_SERVICE_DB_ENV,
                "user_id" : user_id
            }
            SQLBotLogUtil.info(f"Request payload for create a session: {request_data}")

            response = requests.post(settings.EXTERNAL_SQL_GENERATION_SERVICE_URL +  "/create_session", json=request_data,
                                     timeout=settings.EXTERNAL_SQL_GENERATION_SERVICE_TIME_OUT)
            response.raise_for_status()  # 如果请求失败 (非 2xx 状态码)，则抛出异常

            response_data = response.json()
            SQLBotLogUtil.info(f"Response from external service: {response_data}")

            session_id = response_data.get("session_id")
            if not session_id:
                raise SingleMessageError("External service did not return a session.")

            return session_id

        except requests.exceptions.RequestException as e:
            error_msg = f"Failed to call external service to create a session: {e}"
            SQLBotLogUtil.error(error_msg)
            raise SingleMessageError(error_msg) from e
        except Exception as e:
            SQLBotLogUtil.error(f"An error occurred during create a session: {e}")
            raise e

    @classmethod
    def _call_external_service(cls, endpoint: str, payload: dict, stream: bool = False) -> requests.Response:
        """
        A helper method to call the external SQL generation service, handling retries and session management.
        """
        if not settings.EXTERNAL_SQL_GENERATION_SERVICE_URL:
            raise SingleMessageError("External SQL generation service is not configured.")

        url = settings.EXTERNAL_SQL_GENERATION_SERVICE_URL + endpoint
        user_id = payload.get("user_id")
        ds_name = payload.get("db_id")
        ds_type = payload.get("db_type")

        for attempt in range(2):
            session_id = cls._get_session(ds_name, ds_type, user_id)
            payload["session_id"] = session_id

            SQLBotLogUtil.info(f"Request payload for external service (attempt {attempt + 1}): {payload}")

            try:
                response = requests.post(
                    url,
                    json=payload,
                    timeout=settings.EXTERNAL_SQL_GENERATION_SERVICE_TIME_OUT,
                    stream=stream
                )

                # Check for invalid session error to trigger a retry
                if response.status_code == 400 and "Invalid or expired session ID" in response.text:
                    SQLBotLogUtil.warning(f"Invalid session ID for user {user_id}. Deleting and retrying...")
                    with sessions_lock:
                        if user_id in active_sessions:
                            del active_sessions[user_id]
                    continue  # Retry with a new session

                response.raise_for_status()
                return response

            except requests.exceptions.RequestException as e:
                error_msg = f"Failed to call external service endpoint {endpoint}: {e}"
                SQLBotLogUtil.error(error_msg)
                raise SingleMessageError(error_msg) from e

        raise SingleMessageError(f"Failed to call external service at {endpoint} after retrying with a new session.")

    @classmethod
    def generate_sql(cls, question: str, ds_name: str, ds_type: str, user_id: str, oid: int, ds_id: int):
        """
        Generates SQL by calling an external service, with retry logic for expired sessions.
        """
        if not settings.EXTERNAL_SQL_GENERATION_SERVICE_URL:
            raise SingleMessageError("External SQL generation service is not configured.")
        SQLBotLogUtil.info(f"Calling external SQL generation service (non-stream): /nl2sql/chat")

        request_data = {
            "question": question,
            "db_id": ds_name,
            "db_type": ds_type,
            "db_env": settings.EXTERNAL_SQL_GENERATION_SERVICE_DB_ENV,
            "user_id": user_id,
            "oid": oid,
            "datasource_id": ds_id,
        }

        response = cls._call_external_service("/nl2sql/chat", request_data, stream=False)
        response_data = response.json()
        SQLBotLogUtil.info(f"Response from external service: {response_data}")
        
        # 模拟流式响应，封装成一个只包含 final_result 的事件
        final_event = {"event": "final_result", "data": response_data}
        # 使用 orjson 序列化并返回一个生成器
        yield orjson.dumps(final_event).decode('utf-8')

    @classmethod
    def generate_sql_stream(cls, question: str, ds_name: str, ds_type: str, user_id: str, oid: int, ds_id: int):
        """
        Generates SQL by calling an external service with streaming, with retry logic for expired sessions.
        """
        if not settings.EXTERNAL_SQL_GENERATION_SERVICE_URL:
            raise SingleMessageError("External SQL generation service is not configured.")
        SQLBotLogUtil.info(f"Calling external SQL generation service (stream): /nl2sql/chat-stream")

        request_data = {
            "question": question,
            "db_id": ds_name,
            "db_type": ds_type,
            "db_env": settings.EXTERNAL_SQL_GENERATION_SERVICE_DB_ENV,
            "user_id": user_id,
            "oid": oid,
            "datasource_id": ds_id,
        }

        response = cls._call_external_service("/nl2sql/chat-stream", request_data, stream=True)

        try:
            for line in response.iter_lines():
                if line:
                    decoded_line = line.decode('utf-8')
                    if decoded_line.startswith('data:'):
                        try:
                            json_data_str = decoded_line[len('data:'):].strip()
                            if json_data_str:
                                # llm.py expects a JSON string, not a parsed dict.
                                yield json_data_str
                                continue # Avoid yielding the same line twice
                        except orjson.JSONDecodeError as e:
                            SQLBotLogUtil.error(f"Error processing stream line: {decoded_line}, error: {e}")
                            raise SingleMessageError(f"Error processing stream from external service: {e}") from e
        finally:
            response.close()  # Ensure the connection is closed

    @classmethod
    def init_datasource(cls, ds_name: str, db_type: str, host: str, port: int, user: str, password: str, database: str, ds_id: int, ):
        if not settings.EXTERNAL_SQL_GENERATION_SERVICE_URL:
            raise SingleMessageError("External SQL generation service is not configured.")
        SQLBotLogUtil.info(
            f"Calling external SQL generation service to init datasource: {settings.EXTERNAL_SQL_GENERATION_SERVICE_URL}")

        try:
            # 准备请求体
            request_data = {
                "db_id": ds_name,  # 使用数据源名称作为 db_id
                "db_type": db_type,
                "db_env": settings.EXTERNAL_SQL_GENERATION_SERVICE_DB_ENV,
                "host": host,
                "port": port,
                "user": user,
                "password": password,
                "database": database,
                "ds_id": ds_id,
            }
            SQLBotLogUtil.info(f"Request payload for external service: {request_data}")

            response = requests.post(settings.EXTERNAL_SQL_GENERATION_SERVICE_URL + "/init_datasource",
                                     json=request_data, timeout=settings.EXTERNAL_SQL_GENERATION_SERVICE_TIME_OUT)

            response.raise_for_status()

            response_data = response.json()
            SQLBotLogUtil.info(f"Response from external service: {response_data}")
            if not response_data.get("success"):
                raise SingleMessageError(response_data.get("message"))
        except requests.exceptions.RequestException as e:
            error_msg = f"Failed to call external service to generate SQL: {e}"
            SQLBotLogUtil.error(error_msg)
            raise SingleMessageError(error_msg) from e
        except Exception as e:
            SQLBotLogUtil.error(f"An error occurred during call external service to generate SQL: {e}")
            raise


    @classmethod
    def check_datasource_status(cls, ds_name: str, db_type: str) -> bool:
        if not settings.EXTERNAL_SQL_GENERATION_SERVICE_URL:
            raise SingleMessageError("External SQL generation service is not configured.")
        SQLBotLogUtil.info(
            f"Calling external SQL generation service to check datasource status: {settings.EXTERNAL_SQL_GENERATION_SERVICE_URL}")

        try:
            # 准备请求体
            request_data = {
                "db_id": ds_name,  # 使用数据源名称作为 db_id
                "db_type": db_type,
                "db_env": settings.EXTERNAL_SQL_GENERATION_SERVICE_DB_ENV,
            }
            SQLBotLogUtil.info(f"Request payload for external service: {request_data}")

            response = requests.post(settings.EXTERNAL_SQL_GENERATION_SERVICE_URL + "/check_datasource_status",
                                     json=request_data, timeout=settings.EXTERNAL_SQL_GENERATION_SERVICE_TIME_OUT)

            response.raise_for_status()

            response_data = response.json()
            SQLBotLogUtil.info(f"Response from external service: {response_data}")

            datasource_status = response_data.get("status", False)
            return datasource_status

        except requests.exceptions.RequestException as e:
            error_msg = f"Failed to call external service to generate SQL: {e}"
            SQLBotLogUtil.error(error_msg)
            raise SingleMessageError(error_msg) from e
        except Exception as e:
            SQLBotLogUtil.error(f"An error occurred during call external service to generate SQL: {e}")
            raise e
