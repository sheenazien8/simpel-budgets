import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { faker } from "@faker-js/faker";
import { formatMoney } from "../utils/helper";
import { useAccountAction } from "../actions";
import { IProfile, MAccount } from "../models";
import { useAuthAction } from "../actions/auth";
import { UserIcon } from "@heroicons/react/24/solid";
import { Link } from "@inertiajs/inertia-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  indexAxis: "y" as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
    },
    title: {
      display: true,
      text: "Chart.js Horizontal Bar Chart",
    },
  },
};

const labels = ["January", "February"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const Home = () => {
  const { getProfile } = useAuthAction();
  const [profile, setProfile] = useState<IProfile>();
  const [greetingWord, setGreetingWord] = useState<string>("");
  const greeting = () => {
    const date = new Date();
    const hour = date.getHours();
    if (hour < 12) {
      setGreetingWord("Selamat Pagi");
    } else if (hour < 18) {
      setGreetingWord("Selamat Siang");
    } else {
      setGreetingWord("Selamat Malam");
    }
  };

  const load = async () => {
    const data = await getProfile();
    setProfile(data.data.data);
    greeting();
  };

  useEffect(() => {
    load();
  }, []);
  return (
    <Layout>
      <Link href="/profiles">
        <div className="flex items-center gap-x-2">
          <UserIcon className="w-10 h-10 text-gray-400" />
          <div>
            <p className="text-lg font-semibold text-gray-600">
              Hai, {profile?.name}
            </p>
            <span className="text-gray-400">{greetingWord}</span>
          </div>
        </div>
      </Link>
    </Layout>
  );
};

export default Home;
