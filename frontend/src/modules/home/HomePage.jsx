import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./home.style.css";

function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);

  const [params] = useSearchParams();

  useEffect(() => {
    const user = params.get("user");
    const token = params.get("token");
    if (!token || !user) {
      setLoggedIn(false);
    } else {
      console.log(token);
      console.log(JSON.parse(user));
      setLoggedIn(true);
    }
  }, [params]);

  return (
    <main>
      <h1>Welcome to Dummy Online Shop!</h1>

      <p>
        Your go-to destination for stylish, affordable, and high-quality
        products. Whether you're looking for the latest gadgets, trendy fashion,
        or everyday essentials, we’ve got something for everyone. Our mission is
        simple: bring you great products at great prices, with a shopping
        experience that’s fast, friendly, and fun.
      </p>

      <p>
        Browse our featured items or explore our full collection to discover
        even more amazing finds.
      </p>

      <p>
        <Link to="/products" className="link">
          View All Products
        </Link>
      </p>

      <p style={{ display: loggedIn ? "none" : "block" }}>
        <a href="/accounts/login/google">Login with Google</a>
      </p>
    </main>
  );
}

export default HomePage;
