from flask import Blueprint, flash, g, render_template, redirect, request, url_for

# the following line comes from the offical from flask tutorial
from werkzeug.exceptions import abort

# To Enforce login required on some view import the following from the auth blueprint
from board.auth import login_required

from board.db import get_db

bp = Blueprint("posts", __name__)


@bp.route("/create", methods=("POST", "GET"))
# Enforce login for creation of posts
@login_required
def create():
    if request.method == "POST":
        author = g.user["id"]
        message = request.form["message"]
        error = None

        if not message:
            error = "message is required"

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                "INSERT INTO posts (message, author) VALUES(?, ?)",
                (message, g.user["id"]),
            )
            db.commit()
            return redirect(url_for("posts.posts"))
    return render_template("posts/create.html")


@bp.route("/posts")
def posts():
    db = get_db()
    posts = db.execute(
        "SELECT *"
        " FROM posts p JOIN users u ON p.author = u.id"
        " ORDER BY created_at DESC"
    ).fetchall()
    return render_template("posts/posts.html", posts=posts)


# Both the update and delete views will need to fetch a post by id
# and check if the author matches the logged in user.
# To avoid duplicating code, you can write a function to get the post and call it from each view.
def get_post(id):
    post = (
        get_db()
        .execute(
            "SELECT p.id, message, p.created_at, author FROM posts p JOIN users u ON p.author = u.id WHERE p.id = ?",
            (id,),
        )
        .fetchone()
    )

    if post is None:
        abort(404, f"Post id {id} doesn't exist.")

    # if post['author'] != g.user['id']:
    #     abort(403)

    return post


@bp.route("/<int:id>/update", methods=("GET", "POST"))
@login_required
def update(id):
    post = get_post(id)

    if request.method == "POST":
        message = request.form["message"]
        error = None

        if not message:
            error = "Message text is required."

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute("UPDATE posts SET message = ?" " WHERE id = ?", (message, id))
            db.commit()
            return redirect(url_for("posts.posts"))

    return render_template("posts/update.html", post=post)


@bp.route("/<int:id>/delete", methods=("POST",))
@login_required
def delete(id):
    get_post(id)
    db = get_db()
    db.execute("DELETE FROM posts WHERE id = ?", (id,))
    db.commit()
    return redirect(url_for("posts.posts"))


@bp.route("/search", methods=["POST"])
def search_posts():
    search_term = request.form.get("search")

    if not len(search_term):
        return render_template("posts/posts.html", posts=[])

    res_posts = []
    db = get_db()
    posts = db.execute("SELECT * FROM posts ORDER BY created_at DESC").fetchall()

    for post in posts:
        if search_term in post["message"]:
            res_posts.append(post)

    return render_template("posts/posts.html", posts=res_posts)
