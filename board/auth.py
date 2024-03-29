import functools

from flask import (
    Blueprint,
    flash,
    g,
    redirect,
    render_template,
    request,
    session,
    url_for,
)

from werkzeug.security import check_password_hash, generate_password_hash

from nanoid import generate

from board.db import get_db

bp = Blueprint("auth", __name__)


@bp.route("/register", methods=("GET", "POST"))
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        passwordconfirmation = request.form["passwordconfirmation"]
        userID = generate()

        db = get_db()
        error = None

        if not username:
            error = "username is required"
        elif not password:
            error = "password is required"
        elif not passwordconfirmation:
            error = "passwordconfirmation is required"
        elif password != passwordconfirmation:
            error = "Passwords must match."

        if error is None:
            try:
                db.execute(
                    "INSERT INTO users (userID, username, password) VALUES (?, ?, ?)",
                    (userID, username, generate_password_hash(password)),
                )
                db.commit()
            except db.IntegrityError:
                error = f"User {username} already exists."
            else:
                return redirect(url_for("auth.login"))
        flash(error)
    return render_template("auth/register.html")


@bp.route("/login", methods=("GET", "POST"))
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        db = get_db()
        error = None
        user = db.execute(
            "SELECT * FROM users WHERE username = ?", (username,)
        ).fetchone()

        if user is None:
            error = "Incorrect username."
        elif not check_password_hash(user["password"], password):
            error = "Incorrect password."

        if error is None:
            session.clear()
            session["user_id"] = user["userID"]
            return redirect(url_for("posts.posts"))

        flash(error)

    return render_template("auth/login.html")


@bp.before_app_request
def load_logged_in_user():
    user_id = session.get("user_id")

    if user_id is None:
        g.user = None
    else:
        g.user = (
            get_db()
            .execute("SELECT * FROM users WHERE userID = ?", (user_id,))
            .fetchone()
        )


@bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("auth.login"))


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for("auth.login"))

        return view(**kwargs)

    return wrapped_view
