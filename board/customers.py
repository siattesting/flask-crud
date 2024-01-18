from flask import Blueprint, flash, g, render_template, redirect, request, url_for

# the following line comes from the offical from flask tutorial
from werkzeug.exceptions import abort

from nanoid import generate

# To Enforce login required on some view import the following from the auth blueprint
from board.auth import login_required

from board.db import get_db

bp = Blueprint("customers", __name__)


@bp.route("/create", methods=("POST", "GET"))
# Enforce login for creation of customers
@login_required
def create():
    if request.method == "POST":
        created_by = g.user["userID"]
        address = request.form["address"]
        customerID = generate()
        error = None

        if not address:
            error = "address is required"

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                "INSERT INTO customers (address, created_by, customerID) VALUES(?, ?, ?)",
                (address, g.user["userID"], customerID),
            )
            db.commit()
            return redirect(url_for("customers.customers"))
    return render_template("customers/create.html")


@bp.route("/customers")
def customers():
    db = get_db()
    customers = db.execute(
        "SELECT *"
        " FROM customers c JOIN users u ON c.created_by = u.userID"
        " ORDER BY created_at DESC"
    ).fetchall()
    return render_template("customers/customers.html", customers=customers)


# Both the update and delete views will need to fetch a customer by id
# and check if the author matches the logged in user.
# To avoid duplicating code, you can write a function to get the customer and call it from each view.
def get_post(id):
    customer = (
        get_db()
        .execute(
            "SELECT c.customerID, address, c.created_at, c.created_by FROM customers c JOIN users u ON c.created_by = u.userID WHERE c.customerID = ?",
            (id,),
        )
        .fetchone()
    )

    if customer is None:
        abort(404, f"Customer id {id} doesn't exist.")

    # if customer['author'] != g.user['id']:
    #     abort(403)

    return customer


@bp.route("/<customerID>/update", methods=("GET", "POST"))
@login_required
def update(customerID):
    customer = get_post(customerID)

    if request.method == "POST":
        address = request.form["address"]
        error = None

        if not address:
            error = "Message text is required."

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                "UPDATE customers SET address = ?" " WHERE customerID = ?",
                (address, customerID),
            )
            db.commit()
            return redirect(url_for("customers.customers"))

    return render_template("customers/update.html", customer=customer)


@bp.route("/<customerID>/delete", methods=("POST",))
@login_required
def delete(customerID):
    get_post(customerID)
    db = get_db()
    db.execute("DELETE FROM customers WHERE customerID = ?", (customerID,))
    db.commit()
    return redirect(url_for("customers.customers"))


@bp.route("/search", methods=["POST"])
def search_posts():
    search_term = request.form.get("search")

    if not len(search_term):
        return render_template("customers/customers.html", customers=[])

    res_posts = []
    db = get_db()
    customers = db.execute(
        "SELECT * FROM customers ORDER BY created_at DESC"
    ).fetchall()

    for customer in customers:
        if search_term in customer["address"]:
            res_posts.append(customer)

    return render_template("customers/customers.html", customers=res_posts)
