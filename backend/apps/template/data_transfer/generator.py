from apps.template.template import get_base_template


def get_data_transfer_template():
    template = get_base_template()
    return template['template']['data_transfer']
