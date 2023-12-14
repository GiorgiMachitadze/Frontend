import React, { useState } from "react";
import "../styles/BudgetForm.css";

function BudgetForm() {
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    paymentType: "",
    moneyAmount: "",
    creationDate: new Date().toISOString().split("T")[0],
  });

  const [subcategories, setSubcategories] = useState([]);
  const [budgetItems, setBudgetItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      category: selectedCategory,
      subcategory: "",
    }));

    switch (selectedCategory) {
      case "Income":
        setSubcategories([
          "Rental Income",
          "Capital Gains",
          "Business Profit",
          "Pension Income",
          "Gift Income",
        ]);
        break;
      case "Expense":
        setSubcategories([
          "Utilities",
          "Groceries",
          "Transportation",
          "Health Insurance",
          "Education",
        ]);
        break;
      default:
        setSubcategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBudgetItem = {
      category: formData.category,
      subcategory: formData.subcategory,
      paymentType: formData.paymentType,
      moneyAmount: formData.moneyAmount,
      creationDate: formData.creationDate,
      favorite: false,
    };

    setBudgetItems((prevItems) => [...prevItems, newBudgetItem]);

    setFormData({
      category: "",
      subcategory: "",
      paymentType: "",
      moneyAmount: "",
      creationDate: new Date().toISOString().split("T")[0],
    });

    setShowForm(false);
  };

  const handleDelete = (index) => {
    setBudgetItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleFavorite = (index) => {
    setBudgetItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  const handleToggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const filteredBudgetItems = showFavorites
    ? budgetItems.filter((item) => item.favorite)
    : budgetItems;

  return (
    <div className="BudgetFormContainer">
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Add Budget"}
      </button>
      <button onClick={handleToggleFavorites}>
        {showFavorites ? "Show All" : "Show Favorites"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>
            Category:
            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              className="selectInput"
              required
            >
              <option value="">Select Category</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </label>

          <label>
            Subcategory:
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="selectInput"
              required
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))}
            </select>
          </label>

          <label>
            Payment Type:
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              className="selectInput"
              required
            >
              <option value="">Select Payment Type</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </label>

          <label>
            Money Amount:
            <input
              type="number"
              name="moneyAmount"
              value={formData.moneyAmount}
              onChange={handleChange}
              className="textInput"
              required
            />
          </label>

          <button type="submit" className="submitButton">
            Save
          </button>
        </form>
      )}

      <div className="BudgetItemsContainer">
        <h2>Budget Items</h2>
        <div className="BudgetGrid">
          {filteredBudgetItems.map((item, index) => (
            <div key={index} className="BudgetItem">
              <div>Category: {item.category}</div>
              <div>Subcategory: {item.subcategory}</div>
              <div>Payment Type: {item.paymentType}</div>
              <div>Money Amount: {item.moneyAmount}</div>
              <div>Creation Date: {item.creationDate}</div>
              <div>
                <button
                  className="DeleteButton"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
                <button
                  className="FavoriteButton"
                  onClick={() => handleFavorite(index)}
                >
                  {item.favorite ? "Unfavorite" : "Favorite"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BudgetForm;
