import xml.etree.ElementTree as ET

class DataTransfer:

    @staticmethod
    def format_terminologies_for_evidence(xml_string: str) -> str:
        """
        将术语的XML字符串转换为'key=value,key2=value'格式的字符串。
        """
        if not xml_string or xml_string.strip() == '':
            return ""

        try:
            root = ET.fromstring(xml_string)
            evidence_parts = []
            for terminology in root.findall('terminology'):
                description = terminology.find('description').text
                words = [word.text for word in terminology.find('words').findall('word')]
                for word in words:
                    if word and description:
                        evidence_parts.append(f"{word}={description}")
            return "，".join(evidence_parts)
        except ET.ParseError:
            # 如果解析失败，返回原始字符串，因为外部服务可能需要它或记录日志
            return xml_string