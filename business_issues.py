#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time  :  2018/1/11 上午11:16

import tornado.ioloop
import argparse
import os
import logger
import time
import signal
import logging
from tornado.httpserver import HTTPServer
from tornado.log import access_log
from tornado.web import Application
from jinjaloader import JinjaLoader
from routes import get


def install_tornado_shutdown_handler(ioloop, server, logger=None):
    # see https://gist.github.com/mywaiting/4643396 for more detail
    if logger is None:
        import logging
        logger = logging

    def _sig_handler(sig, frame):
        logger.debug("Signal %s received. Preparing to stop server.", sig)
        ioloop.add_callback(shutdown)

    def shutdown():
        logger.debug("Stopping http server...")
        server.stop()
        MAX_WAIT_SECONDS_BEFORE_SHUTDOWN = 3
        logger.debug("Will shutdown in %s seconds",
                    MAX_WAIT_SECONDS_BEFORE_SHUTDOWN)
        deadline = time.time() + MAX_WAIT_SECONDS_BEFORE_SHUTDOWN

        def stop_loop():
            now = time.time()
            if now < deadline and (ioloop._callbacks or ioloop._timeouts):
                ioloop.add_timeout(now + 1, stop_loop)
                logger.debug("Waiting for callbacks and timeouts in IOLoop...")
            else:
                ioloop.stop()
                logger.info("Server is shutdown")

        stop_loop()

    signal.signal(signal.SIGTERM, _sig_handler)
    signal.signal(signal.SIGINT, _sig_handler)


class BusinessIssues(Application):

    def log_request(self, handler):
        if handler.request.uri == '/ping':
            return
        request_time = 1000.0 * handler.request.request_time()
        extra = {'request_handler': handler}
        log_method = access_log.info
        if handler.get_status() < 400:
            if request_time > 3000.0:
                extra['type'] = 'slowreq'
                log_method = access_log.warn
            elif request_time > 10000.0:
                extra['type'] = 'slowreq'
                log_method = access_log.error
        elif handler.get_status < 500:
            log_method = access_log.warn
        else:
            log_method = access_log.error

        log_method("{}, {}, {}".format(handler.get_status(), handler._request_summary(), request_time), extra=extra)


def main(args):
    template_loader = JinjaLoader(os.path.join(os.path.dirname(__file__), 'templates/'))
    application = BusinessIssues(get(),
                                 template_loader=template_loader,
                                 static_path=os.path.join(os.path.dirname(__file__), "static"),
                                 xsrf_cookies=False,
                                 debug=args.debug)
    server = HTTPServer(application, xheaders=True)
    server.listen(args.port)
    logger.setup()
    install_tornado_shutdown_handler(tornado.ioloop.IOLoop.instance(), server, logging.getLogger())
    logging.info('start service at ' + time.ctime() + '\n')
    tornado.ioloop.IOLoop.current().start()


if __name__ == '__main__':
    argp = argparse.ArgumentParser()
    argp.add_argument('--port', required=1, type=int)
    argp.add_argument('--debug', default=1, type=int)
    args = argp.parse_args()
    import sys
    sys.exit(main(args))

