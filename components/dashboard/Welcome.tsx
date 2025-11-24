import { userData } from "@/data";

const Welcome = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {userData.name.split(" ")[0]}!
      </h1>
      <p className="text-gray-600 mt-1">
        Monitor and optimize your website performance
      </p>
    </div>
  );
};

export default Welcome;
