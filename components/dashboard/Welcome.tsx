import { myKindeUser } from "@/types/types";

const Welcome = ({ user }: myKindeUser) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {user?.given_name}!
      </h1>
      <p className="text-gray-600 mt-1">
        Monitor and optimize your website performance
      </p>
    </div>
  );
};

export default Welcome;
