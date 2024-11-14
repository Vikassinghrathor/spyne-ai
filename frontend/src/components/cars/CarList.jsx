import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { carService } from "../../services/api";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchCars = async (searchTerm = "") => {
    try {
      setLoading(true);
      const data = await carService.getCars(searchTerm);
      setCars(data);
    } catch (err) {
      setError("Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCars(search);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await carService.deleteCar(id);
        setCars(cars.filter((car) => car._id !== id));
      } catch (err) {
        setError("Failed to delete car");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Cars</h1>
        <Link
          to="/cars/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add New Car
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cars..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car._id}
            className="border rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={car.images[0]}
              alt={car.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{car.title}</h2>
              <p className="text-gray-600 mb-4">
                {car.description.substring(0, 100)}...
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(car.tags).map(([key, value]) => (
                  <span
                    key={key}
                    className="bg-gray-200 px-2 py-1 rounded-full text-sm"
                  >
                    {value}
                  </span>
                ))}
              </div>
              <div className="flex justify-between">
                <Link
                  to={`/cars/${car._id}`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(car._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cars.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No cars found. Add your first car!
        </div>
      )}
    </div>
  );
};

export default CarList;
