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
import { MAccount } from "../models";

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
  const { get } = useAccountAction();
  const [accounts, setAccounts] = useState<MAccount[]>();
  const [account_total, setAccountsTotal] = useState<number>();
  const load = async () => {
    const accounts = await get();
    setAccounts(accounts.data.data?.data);
    setAccountsTotal(accounts.data.data?.account_sum_total);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="border rounded-md">
        <div className="border-gray-200 px-3 py-5 sm:px-6">
          <h3 className="font-medium leading-6 text-gray-900 break-words">
            Total Saldo:{" "}
            <span className="font-bold">
              {formatMoney(account_total)}
            </span>
          </h3>
        </div>
        <div className="grid grid-cols-2">
          {accounts?.map((account) => (
            <div className="p-1">
              <div className="p-3 border rounded-lg border-gray-400">
                <p className="text-xs">{account.name}</p>
                <p className="text-sm font-semibold break-words">
                  {formatMoney(account.total)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
