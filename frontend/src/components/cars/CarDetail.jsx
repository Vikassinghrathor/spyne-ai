import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { carService } from "../../services/api";

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const data = await carService.getCarById(id);
      setCar(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch car details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await carService.deleteCar(id);
        navigate("/cars");
      } catch (err) {
        setError("Failed to delete car");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Car not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">{car.title}</h1>
        <div className="space-x-4">
          <Link
            to={`/cars/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={car.images[activeImage]}
              alt={car.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {car.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`aspect-w-1 aspect-h-1 ${
                  activeImage === index ? "ring-2 ring-indigo-500" : ""
                }`}
              >
                <img
                  src={image}
                  alt={`${car.title} ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {car.description}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Car Type</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {car.tags.car_type}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Company</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {car.tags.company}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Dealer</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {car.tags.dealer}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Added</h2>
            <p className="text-gray-600">
              {new Date(car.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
