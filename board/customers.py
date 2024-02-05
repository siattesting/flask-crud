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
        author = g.user["userID"]
        CustomerName = request.form["CustomerName"]
        ContactName = request.form["ContactName"]
        Address = request.form["Addres"]
        City = request.form["City"]
        PostalCode = request.form["PostalCode"]
        Country = request.form["Country"]
        customerID = generate()
        error = None

        if not CustomerName:
            error = "Customer Name is required"
        if not ContactName:
            error = "Contact Name is required"
        if not Address:
            error = "Address is required"
        if not City:
            error = "City is required"
        if not PostalCode:
            error = "Postal Code is required"
        if not Country:
            error = "Country is required"

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                "INSERT INTO Customers (CustomerID, CustomerName, ContactName, Address, City, PostalCode, Country, author) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    customerID,
                    CustomerName,
                    ContactName,
                    Address,
                    City,
                    PostalCode,
                    Country,
                    g.user["userID"],
                ),
            )
            db.commit()
            return redirect(url_for("customers.customers"))
    return render_template("customers/create.html")


@bp.route("/customers")
def customers():
    db = get_db()
    customers = db.execute(
        "SELECT c.customerID, c.Customername,  c.address, c.city, c.PostalCode, c.country, c.created_at, c.author FROM customers c JOIN users u ON c.author = u.userID"
        " ORDER BY CustomerName ASC"
    ).fetchall()
    return render_template("customers/customers.html", customers=customers)


# Both the update and delete views will need to fetch a customer by id
# and check if the author matches the logged in user.
# To avoid duplicating code, you can write a function to get the customer and call it from each view.
def get_customer(id):
    customer = (
        get_db()
        .execute(
            "SELECT c.customerID, c.address, c.city, c.country, c.PostalCode, c.created_at, c.created_by FROM customers c JOIN users u ON c.author = u.userID WHERE c.customerID = ?",
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
    customer = get_customer(customerID)

    if request.method == "POST":
        address = request.form["address"]
        error = None

        if not address:
            error = "Address text is required."

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

    res_customers = []
    db = get_db()
    customers = db.execute(
        "SELECT * FROM customers ORDER BY created_at DESC"
    ).fetchall()

    for customer in customers:
        if search_term in customer["address"]:
            res_customers.append(customer)

    return render_template("customers/customers.html", customers=res_customers)
