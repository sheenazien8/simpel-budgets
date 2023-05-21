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
import { IProfile } from "../models";
import { useAuthAction } from "../actions/auth";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Link } from "@inertiajs/inertia-react";
import Select, { IOption } from "../Components/Input/Select";
import { formatMoney } from "../utils/helper";
import { useDashboardAction } from "../actions/dashboard";
import { SummaryFinancialRecord } from "../models/dashboard";

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
  const { financialRecord } = useDashboardAction();
  const [financialRecordOption, setFinancialRecordOption] = useState<IOption>({
    label: "7 Hari",
    value: "7 days",
  });
  const [financialRecordData, setFinancialRecordData] =
    useState<SummaryFinancialRecord>();
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
    const financialRecordData = await financialRecord({
      recapBy: financialRecordOption.value as string,
    });
    setFinancialRecordData(financialRecordData.data);
  };

  useEffect(() => {
    load();
  }, [financialRecordOption]);

  return (
    <Layout noPadding>
      <>
        <Link href="/profiles">
          <div className="flex items-center gap-x-2 px-4">
            <UserIcon className="w-10 h-10 text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-gray-600">
                Hai, {profile?.name}
              </p>
              <span className="text-gray-400">{greetingWord}</span>
            </div>
          </div>
        </Link>
        <div className="pl-4">
          <div className="pr-4 flex gap-x-4 justify-between items-center">
            <p className="text-lg">Financial Record</p>
            <Select
              name={"fincancial_record"}
              options={[
                { label: "7 hari terakhir", value: "7 days" },
                { label: "30 hari terakhir", value: "30 days" },
                { label: "1 bulan ini", value: "1 month" },
                { label: "3 bulan ini", value: "3 month" },
              ]}
              value={financialRecordOption.value}
              onChange={(e) => {
                setFinancialRecordOption({
                  value: e.target.value,
                  label: e.target.value,
                });
              }}
            />
          </div>
          <div className="z-20 relative overflow-x-scroll">
            <div className="grid grid-cols-[200px_200px_200px] gap-x-3 my-4">
              <div className="px-3 py-4 border border-gray-300 rounded-lg shadow-gray-300 shadow">
                <p className="font-light text-sm">Total Income</p>
                <p className="font-semibold text-base">
                  {formatMoney(financialRecordData?.income?.total)}
                </p>
                <p className="font-light text-xs flex items-center">
                  {financialRecordData?.income?.isUp ? (
                    <ArrowUpRightIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowDownLeftIcon className="w-5 h-5 text-red-500" />
                  )}{" "}
                  {financialRecordData?.income?.percentage}
                </p>
              </div>
              <div className="px-3 py-4 border border-gray-300 rounded-lg shadow-gray-300 shadow">
                <p className="font-light text-sm">Total Expense</p>
                <p className="font-semibold text-base">
                  {formatMoney(financialRecordData?.expense?.total)}
                </p>
                <p className="font-light text-xs flex items-center">
                  {financialRecordData?.expense?.isUp ? (
                    <ArrowUpRightIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowDownLeftIcon className="w-5 h-5 text-red-500" />
                  )}{" "}
                  {financialRecordData?.expense?.percentage}
                </p>
              </div>
              <div className="px-3 py-4 border border-gray-300 rounded-lg shadow-gray-300 shadow">
                <p className="font-light text-sm">Total Tabungan</p>
                <p className="font-semibold text-base">
                  {formatMoney(financialRecordData?.saving?.total)}
                </p>
                <p className="font-light text-xs flex items-center">
                  {financialRecordData?.saving?.isUp ? (
                    <ArrowUpRightIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowDownLeftIcon className="w-5 h-5 text-red-500" />
                  )}{" "}
                  {financialRecordData?.saving?.percentage}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4"></div>
      </>
    </Layout>
  );
};

export default Home;
