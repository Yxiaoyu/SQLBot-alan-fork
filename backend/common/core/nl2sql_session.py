# Store active sessions
from threading import Lock
from typing import Dict

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
    def generate_sql(cls, question: str, ds_name: str, ds_type: str, user_id: str, oid: int, ds_id: int) -> dict:
        """
        Generates SQL by calling an external service, with retry logic for expired sessions.
        """
        if not settings.EXTERNAL_SQL_GENERATION_SERVICE_URL:
            raise SingleMessageError("External SQL generation service is not configured.")
        SQLBotLogUtil.info(f"Calling external SQL generation service to generate SQL: {settings.EXTERNAL_SQL_GENERATION_SERVICE_URL}")

        for attempt in range(2):
            session_id = cls._get_session(ds_name, ds_type, user_id)
            try:
                # 准备请求体
                request_data = {
                    "question": question,
                    "db_id": ds_name,  # 使用数据源名称作为 db_id
                    "db_type": ds_type,  # 使用数据源类型作为 db_type
                    "db_env": settings.EXTERNAL_SQL_GENERATION_SERVICE_DB_ENV,
                    "user_id": user_id,
                    "oid": oid,
                    "datasource_id": ds_id,
                    "session_id": session_id,
                }
                SQLBotLogUtil.info(f"Request payload for external service (attempt {attempt + 1}): {request_data}")

                response = requests.post(settings.EXTERNAL_SQL_GENERATION_SERVICE_URL + "/nl2sql/chat", json=request_data, timeout=settings.EXTERNAL_SQL_GENERATION_SERVICE_TIME_OUT)

                # Check for invalid session error
                if response.status_code == 400 and "Invalid or expired session ID" in response.text:
                    SQLBotLogUtil.warning(f"Invalid session ID for user {user_id}. Deleting and retrying...")
                    with sessions_lock:
                        if user_id in active_sessions:
                            del active_sessions[user_id]
                    continue  # Retry with a new session

                response.raise_for_status()

                response_data = response.json()
                SQLBotLogUtil.info(f"Response from external service: {response_data}")

                is_generated_sql = response_data.get("is_generated_sql", False)
                final_answer = response_data.get("final_answer", '')
                question = response_data.get("question", '')

                return {"is_generated_sql": is_generated_sql, "final_answer": final_answer, "question": question}

            except requests.exceptions.RequestException as e:
                error_msg = f"Failed to call external service to generate SQL: {e}"
                SQLBotLogUtil.error(error_msg)
                raise SingleMessageError(error_msg) from e
            except Exception as e:
                SQLBotLogUtil.error(f"An error occurred during call external service to generate SQL: {e}")
                raise e

        # If all retries fail
        raise SingleMessageError("Failed to generate SQL after retrying with a new session.")

    @classmethod
    def init_datasource(cls, ds_name: str, db_type: str, host: str, port: int, user: str, password: str, database: str ):
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
            }
            SQLBotLogUtil.info(f"Request payload for external service: {request_data}")

            response = requests.post(settings.EXTERNAL_SQL_GENERATION_SERVICE_URL + "/init_datasource",
                                     json=request_data, timeout=settings.EXTERNAL_SQL_GENERATION_SERVICE_TIME_OUT)

            response.raise_for_status()

            response_data = response.json()
            SQLBotLogUtil.info(f"Response from external service: {response_data}")

        except requests.exceptions.RequestException as e:
            error_msg = f"Failed to call external service to generate SQL: {e}"
            SQLBotLogUtil.error(error_msg)
            raise SingleMessageError(error_msg) from e
        except Exception as e:
            SQLBotLogUtil.error(f"An error occurred during call external service to generate SQL: {e}")
            raise e


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

