import React, { useEffect, useState } from "react";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { useAuthAction, useDashboardAction } from "@/actions";
import { IOption, Layout, Modal, Select } from "@/ui";
import { IProfile, Shortcuts, SummaryFinancialRecord } from "@/models";
import { classNames, formatMoney } from "@/utils/helper";
import { getDictionary, translate } from "../dictionaries";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import styles from "./shortcut.module.css";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import * as Icons from "@heroicons/react/24/outline";

export async function getStaticProps(props: any) {
  const dict = await getDictionary(props.params.lang);
  return {
    props: {
      lang: dict.dashboard,
      locale: props.params.lang,
    },
  };
}

export function getStaticPaths() {
  return {
    paths: [{ params: { lang: "id" } }, { params: { lang: "en" } }],
    fallback: false,
  };
}

export default function Page({ lang, locale }: any) {
  const { getProfile } = useAuthAction();
  const { financialRecord, getShortcuts } = useDashboardAction();
  const [financialRecordOption, setFinancialRecordOption] = useState<IOption>({
    label: "1 bulan ini",
    value: "1 month",
  });
  const [financialRecordData, setFinancialRecordData] =
    useState<SummaryFinancialRecord[]>();
  const [shortcuts, setShortcuts] = useState<Shortcuts[]>();
  const [profile, setProfile] = useState<IProfile>();
  const [isFormShortcutActive, setFormShortcutActive] =
    useState<boolean>(false);
  const [greetingWord, setGreetingWord] = useState<string>("");
  const [editShortcut, setEditShortcut] = useState<boolean>(false);
  const greeting = () => {
    const date = new Date();
    const hour = date.getHours();
    if (hour < 12) {
      setGreetingWord(
        translate(lang.greetingTime, { time: lang.greetingTimeMorning }),
      );
    } else if (hour < 18) {
      setGreetingWord(
        translate(lang.greetingTime, { time: lang.greetingTimeAfternoon }),
      );
    } else {
      setGreetingWord(
        translate(lang.greetingTime, { time: lang.greetingTimeNight }),
      );
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

  // const loadShortcut = async () => {
  //   const data = await getShortcuts();
  //   let mapped: Shortcuts[] = [];
  //   data.data?.map((item: Shortcuts) => {
  //     const icons: React.ForwardRefExoticComponent<
  //       Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
  //         title?: string | undefined;
  //         titleId?: string | undefined;
  //       } & React.RefAttributes<SVGSVGElement>
  //     > = Icons[item.icon];
  //
  //     mapped.push({
  //       id: item.id,
  //       name: item.name,
  //       icon: item.icon,
  //       iconJsx: icons,
  //       url: item.url,
  //     });
  //   });
  //
  //   setShortcuts(mapped);
  // };

  // useEffect(() => {
  //   if (isFormShortcutActive) {
  //     loadShortcut();
  //   }
  // }, [isFormShortcutActive]);

  return (
    <Layout loading={financialRecordData == undefined}>
      <div>
        <Link href={`/${locale}/profiles`}>
          <div className="flex items-center gap-x-2 px-4">
            <UserIcon className="w-10 h-10 text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-gray-600">
                {translate(lang.greetings, { username: profile?.name })}
              </p>
              <span className="text-gray-400">{greetingWord}</span>
            </div>
          </div>
        </Link>
        <div>
          <div className="flex gap-x-4 items-center z-0">
            <Select
              block
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
          <div className="">
            <div className="grid grid-cols-2 gap-3 my-4">
              {financialRecordData?.map((fincance) => (
                <div className="px-3 py-4 border border-gray-300 rounded-lg shadow-gray-300 shadow">
                  <p className="font-light text-sm">{translate(lang.label, { label: fincance.label })}</p>
                  <p className="font-semibold text-base">
                    {formatMoney(fincance?.total)}
                  </p>
                  <p className="font-light text-xs flex items-center">
                    {fincance?.isUp ? (
                      <ArrowUpRightIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowDownLeftIcon className="w-5 h-5 text-red-500" />
                    )}{" "}
                    {fincance?.percentage}
                  </p>
                </div>
              ))}
              {/* <div className="px-3 py-4 border border-gray-300 rounded-lg shadow-gray-300 shadow">
                <p className="font-light text-sm">{lang.totalExpense}</p>
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
                <p className="font-light text-sm">{lang.remainingSaldo} </p>
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
              </div> */}
            </div>
          </div>
        </div>
        {/* <div className="px-4 space-y-2"> */}
        {/*   <div className="flex justify-between"> */}
        {/*     <p>Shortcut</p> */}
        {/*     <p */}
        {/*       className="text-blue-400 cursor-pointer" */}
        {/*       onClick={() => setEditShortcut(!editShortcut)} */}
        {/*     > */}
        {/*       {editShortcut ? "Done" : "Edit"} */}
        {/*     </p> */}
        {/*   </div> */}
        {/*   <div className="grid grid-cols-2 gap-3"> */}
        {/*     <div */}
        {/*       className={classNames( */}
        {/*         "px-3 py-4 border border-gray-300 rounded-lg shadow-gray-300 shadow", */}
        {/*         editShortcut ? styles.shake : "", */}
        {/*       )} */}
        {/*     > */}
        {/*       <div className="space-y-2"> */}
        {/*         <BanknotesIcon className="w-7 h-7" /> */}
        {/*         <p className="text-base">Add new record</p> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*     <div */}
        {/*       className={classNames( */}
        {/*         "px-3 py-4 border border-gray-300 rounded-lg shadow-gray-300 shadow", */}
        {/*         editShortcut ? styles.shake : "", */}
        {/*       )} */}
        {/*     > */}
        {/*       <div className="space-y-2"> */}
        {/*         <BanknotesIcon className="w-7 h-7" /> */}
        {/*         <p className="text-base">Add new record</p> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*     <div */}
        {/*       className={classNames( */}
        {/*         "px-3 py-4 border border-gray-300 rounded-lg shadow-gray-300 shadow", */}
        {/*         editShortcut ? styles.shake : "", */}
        {/*       )} */}
        {/*     > */}
        {/*       <div className="space-y-2"> */}
        {/*         <BanknotesIcon className="w-7 h-7" /> */}
        {/*         <p className="text-base">Add new record</p> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*     <div */}
        {/*       className="px-3 py-4 rounded-lg bg-blue-400/30" */}
        {/*       onClick={() => setFormShortcutActive(true)} */}
        {/*     > */}
        {/*       <div className="flex flex-col items-center gap-x-2"> */}
        {/*         <PlusCircleIcon className="w-10 h-10 text-blue-400" /> */}
        {/*         <p className="text-blue-400 text-xs">Add new</p> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}
        {/* <Modal */}
        {/*   open={isFormShortcutActive} */}
        {/*   setOpen={(status) => setFormShortcutActive(status)} */}
        {/*   title="Add Shortcut" */}
        {/* > */}
        {/*   <div className="grid grid-cols-2 gap-3"> */}
        {/*     {shortcuts?.map((shortcut: Shortcuts, index: number) => ( */}
        {/*       <div */}
        {/*         key={index} */}
        {/*         className={classNames( */}
        {/*           "px-3 py-4 border border-gray-300 rounded-lg shadow-gray-300 shadow", */}
        {/*         )} */}
        {/*       > */}
        {/*         <div className="space-y-2"> */}
        {/*           <Icons as={shortcut.icon} className="w-7 h-7" /> */}
        {/*           {/* {shortcut.iconJsx && <shortcut.iconJsx className="w-7 h-7" />} */}
        {/*           <p className="text-base">{shortcut.name}</p> */}
        {/*         </div> */}
        {/*       </div> */}
        {/*     ))} */}
        {/*   </div> */}
        {/* </Modal> */}
      </div>
    </Layout>
  );
}
