import React, { useEffect, useState } from "react";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { useAuthAction, useDashboardAction } from "@/actions";
import { IOption, Layout, Select } from "@/ui";
import { IProfile, SummaryFinancialRecord } from "@/models";
import { formatMoney } from "@/utils/helper";

const Home = () => {
  const { getProfile } = useAuthAction();
  const { financialRecord } = useDashboardAction();
  const [financialRecordOption, setFinancialRecordOption] = useState<IOption>({
    label: "1 bulan ini",
    value: "1 month",
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
          <div className="overflow-x-scroll">
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
                <p className="font-light text-sm">Sisa saldo</p>
                <p className="font-semibold text-base">
                  {formatMoney(financialRecordData?.remaining?.total)}
                </p>
                <p className="font-light text-xs flex items-center">
                  {financialRecordData?.remaining?.isUp ? (
                    <ArrowUpRightIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowDownLeftIcon className="w-5 h-5 text-red-500" />
                  )}{" "}
                  {financialRecordData?.remaining?.percentage}
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
