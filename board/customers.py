from flask import Blueprint, flash, g, render_template, redirect, request, url_for

# the following line comes from the offical from flask tutorial
from werkzeug.exceptions import abort

from nanoid import generate

# To Enforce login required on some view import the following from the auth blueprint
from board.auth import login_required

from board.db import get_db, query_db

bp = Blueprint("customers", __name__)


@bp.route("/customers/create", methods=("POST", "GET"))
# Enforce login for creation of customers
@login_required
def create():
    if request.method == "POST":
        author = g.user["userID"]
        customername = request.form["customername"]
        contactname = request.form["contactname"]
        address = request.form["address"]
        city = request.form["city"]
        postalcode = request.form["postalcode"]
        country = request.form["country"]
        error = None

        if not customername:
            error = "Customer Name is required"
        if not contactname:
            error = "Contact Name is required"
        if not address:
            error = "Address is required"
        if not city:
            error = "City is required"
        if not postalcode:
            error = "Postal Code is required"
        if not country:
            error = "Country is required"

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                "INSERT INTO Customers (CustomerName, ContactName, Address, City, PostalCode, Country, author) VALUES(?, ?, ?, ?, ?, ?, ?)",
                (
                    customername,
                    contactname,
                    address,
                    city,
                    postalcode,
                    country,
                    g.user["userID"],
                ),
            )
            db.commit()
            return redirect(url_for("customers.customers"))
        # make it redirect to the newly created Customer
    return render_template("customers/create.html")


# @bp.route("/customers")
# def customers():
#     db = get_db()
#     viewmode = "list"
#     search = request.args.get("q")
#     if search is None:
#         # no search parameter, retrieve all customers
#         customers_set = db.execute(
#             "SELECT c.customerID, c.Customername, c.address, c.city, c.PostalCode, c.country, c.created_at, c.author, username FROM customers c JOIN users u ON c.author = u.userID"
#             " ORDER BY CustomerName ASC"
#         ).fetchall()
#     else:
#         customers_set = query_db(
#             "select * from Customers where CustomerName LIKE ?", search
#         )

#     return render_template(
#         "customers/customers.html", customers=customers_set, viewmode=viewmode
#     )


@bp.route("/customers")
def customers():
    db = get_db()
    viewmode = "list"
    search = request.args.get("q")
    if search is None:
        # no search parameter, retrieve all customers
        customers_set = db.execute(
            "SELECT c.customerID, c.Customername, c.address, c.city, c.PostalCode, c.country, c.created_at, c.author, username FROM customers c JOIN users u ON c.author = u.userID"
            " ORDER BY CustomerName ASC"
        ).fetchall()
    else:
        customers_set = query_db(
            "select * from Customers where CustomerName LIKE ?", search
        )
    if viewmode is "list":
        return render_template(
            "customers/customers.html", customers=customers_set, viewmode="list"
        )

    return render_template(
        "customers/customers.html", customers=customers_set, viewmode="table"
    )


# Both the update and delete views will need to fetch a customer by id
# and check if the author matches the logged in user.
# To avoid duplicating code, you can write a function to get the customer and call it from each view.
def get_customer(id):
    customer = (
        get_db()
        .execute(
            "SELECT c.customerID, c.address, c.city, c.country, c.PostalCode, c.created_at, c.author, username FROM customers c JOIN users u ON c.author = u.userID WHERE c.customerID = ?",
            (id,),
        )
        .fetchone()
    )

    if customer is None:
        abort(404, f"Customer id {id} doesn't exist.")

    # if customer['author'] != g.user['id']:
    #     abort(403)

    return customer


@bp.route("/customers/<customerID>/update", methods=("GET", "POST"))
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


@bp.route("/customers/<customerID>/delete", methods=("POST",))
@login_required
def delete(customerID):
    get_customer(customerID)
    db = get_db()
    db.execute("DELETE FROM customers WHERE customerID = ?", (customerID,))
    db.commit()
    return redirect(url_for("customers.customers"))


@bp.route("/customers/search", methods=["POST"])
def search_posts():
    db = get_db()
    customers = db.execute(
        "SELECT * FROM customers ORDER BY created_at DESC"
    ).fetchall()
    search_term = request.form.get("search")

    if not len(search_term):
        return render_template("customers/_customersrows.html", customers=customers)

    res_customers = []

    for customer in customers:
        if search_term in customer["CustomerName"]:
            res_customers.append(customer)
        elif search_term in customer["ContactName"]:
            res_customers.append(customer)
        elif search_term in customer["Address"]:
            res_customers.append(customer)
        elif search_term in customer["City"]:
            res_customers.append(customer)
        elif search_term in customer["Country"]:
            res_customers.append(customer)
        else:
            res_customers = customers

    return render_template("customers/_customersrows.html", customers=res_customers)
