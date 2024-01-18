import os

# import load_dotenv
from dotenv import load_dotenv

from flask import Flask

from board import pages, posts, customers, db, auth

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_prefixed_env()

    # database.init_app(app)
    db.init_app(app)

    app.register_blueprint(auth.bp)
    app.register_blueprint(pages.bp)
    app.register_blueprint(posts.bp)
    app.register_blueprint(customers.bp)

    print(f"Current Environment: {os.getenv('ENVIRONMENT')}")
    print(f"Using Database: {app.config.get('DATABASE')}")

    return app
