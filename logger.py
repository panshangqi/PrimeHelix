#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time  :  2018/1/11 下午1:47

import json
import logging
import logging.config
import os
import socket

from logging.handlers import SocketHandler

config = dict(deployment_stage='')


class JsonFormatter(logging.Formatter):
    def format(self, record):
        ret = dict()

        ret.update({'msg': super(JsonFormatter, self).format(record),
                    'timestamp': self.formatTime(record, self.datefmt),
                    'level': record.levelname,
                    'type': record.__dict__['type'] if 'type' in record.__dict__ else 'python'})

        for key in ['deployment', 'app', 'userid', 'url', 'name', 'client_ip', 'hostname']:
            if key in record.__dict__:
                ret[key] = record.__dict__[key]

        if 'app' not in ret:
            ret['app'] = 'kuailexue'

        detail = dict()
        for key in record.__dict__:
            if key not in ['deployment', 'app', 'levelname', 'name', 'msg', 'userid', 'url', 'type', 'client_ip', 'hostname',
                           'args', 'created', 'exc_info', 'exc_text', 'levelno', 'pathname', 'process', 'processName',
                           'msecs', 'relativeCreated', 'thread', 'threadName', 'message', 'color', 'end_color', 'asctime']:
                detail[key] = record.__dict__[key]

        if len(detail) > 0:
            ret['detail'] = detail

        return json.dumps(ret, ensure_ascii=False, skipkeys=True)


class LoggerFilter(logging.Filter):
    def filter(self, record):
        record.__dict__.update(
            {"app": "kuailexue",
             "deployment": config['deployment_stage'],
             'hostname': socket.gethostname()})

        if hasattr(record, 'request_handler'):
            request_time = 1000.0 * record.request_handler.request.request_time()
            user_id = record.request_handler.current_user.user_id if getattr(record.request_handler, '_current_user', None) is not None and hasattr(record.request_handler.current_user, 'user_id') else ''
            record.__dict__.update({
                'url': record.url if hasattr(record, 'url') else record.request_handler.request.uri,
                'spent': '%.2f' % request_time, 'status': record.request_handler.get_status(),
                'client_ip': record.request_handler.request.headers.get('X-FORWARDED-FOR', default=record.request_handler.request.remote_ip),
                'userid': '{0}'.format(user_id),
                'request': dict(
                    request=record.request_handler.request.__repr__(),
                    args=json.dumps(record.request_handler.request.arguments) if record.request_handler.request.method not in ('HEAD', 'GET', 'OPTIONS') and record.request_handler.request.arguments else ''
                )
            })

            del record.__dict__['request_handler']

        return super(LoggerFilter, self).filter(record)


class LoggingServerHandler(SocketHandler):
    def filter(self, record):
        if record.levelno < logging.INFO:
            return False

        return super(LoggingServerHandler, self).filter(record)


def setup(cfg=None):
    if cfg and isinstance(cfg, dict):
        config.update(cfg)

    if os.path.exists('logger.conf'):
        logging.config.fileConfig('logger.conf', disable_existing_loggers=False)

    logger_filter = LoggerFilter()
    logging.getLogger().addFilter(logger_filter)

    for logger_name in list(logging.getLogger().manager.loggerDict.keys()):
        if logger_name.startswith('es.') or logger_name.startswith('tornado'):
            logging.getLogger(logger_name).addFilter(logger_filter)
