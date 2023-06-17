import React, { useEffect, useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import {
  ArrowDownIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  ArrowsRightLeftIcon,
  ArrowUpIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { useCashflowAction } from "@/actions";
import { MCashflow, RCashflow, ResponseGetMCashflow } from "@/models";
import {
  formatMoney,
  resolveQueryParameter,
  useHashRouteToggle,
} from "@/utils/helper";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, CardList, EmptyState, Layout, Modal } from "@/ui";
import FormData from "@/components/cashflow/form-data";
import FormFilter from "@/components/cashflow/form-filter";
import { useRouter } from "next/router";
import { getDictionary } from "../dictionaries";

interface IRecord {}

export async function getStaticProps(props: any) {
  const dict = await getDictionary(props.params.lang);
  return {
    props: {
      dict: dict,
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

const List = ({ dict, locale }: any) => {
  const { get } = useCashflowAction();
  const [cashflows, setCashflows] = useState<ResponseGetMCashflow>();
  const [cashflowsData, setCashflowsData] = useState<MCashflow[]>();
  const [isOpenFilter, toggleFilterActive] =
    useState<boolean>(false);
  const [filter, setFilter] = useState<RCashflow>();
  const [scroll, setScroll] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [height, setHeight] = useState(0);
  const router = useRouter();

  const load = async () => {
    const params = resolveQueryParameter(location.search);
    const filters: RCashflow = {
      account_id: params.get("account_id") ?? "",
      account_target: params.get("account_target") ?? "",
      budget_id: params.get("budget_id") ?? "",
      notes: params.get("notes") ?? "",
      date: params.get("date") ?? "",
      type: Number(params.get("type")) ?? "",
      month_id: params.get("month_id") ?? "",
    };
    setFilter(filters);
    const cashflows = await get(filters);
    setCashflows(cashflows.data.data);
    setCashflowsData(cashflows.data.data?.data);
    toggleFilterActive(false);
    if (cashflows.data.data?.data.length == (cashflowsData?.length ?? 0)) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    load();
  }, [router]);

  useEffect(() => {
    setHeight(document?.documentElement?.offsetHeight - 310);
  }, []);

  return (
    <>
      <div>
        <div className="border border-gray-200 px-2 py-6 rounded-lg my-4">
          <div className="grid grid-cols-3 break-words">
            <div className="mx-auto text-center">
              <p className="flex items-center justify-center gap-x-1">
                <ArrowDownIcon className="inline-block w-4 h-4 text-green-500" />
                <span className="text-sm font-light">
                  {dict.cashflow.income}
                </span>
              </p>
              <span className="font-semibold text-sm text-green-500">
                {formatMoney(cashflows?.transaction_sum_nominal_income, false)}
              </span>
            </div>
            <div className="mx-auto text-center">
              <p className="flex items-center justify-center gap-x-1">
                <ArrowUpIcon className="inline-block w-4 h-4 text-red-500" />
                <span className="text-sm font-light">
                  {dict.cashflow.expense}
                </span>
              </p>
              <span className="font-semibold text-sm text-red-500">
                {formatMoney(cashflows?.transaction_sum_nominal_expense, false)}
              </span>
            </div>
            <div className="mx-auto text-center">
              <p className="flex items-center justify-center gap-x-1">
                <CurrencyDollarIcon className="inline-block w-4 h-4 text-indigo-500" />
                <span className="text-sm font-light">
                  {dict.cashflow.budget}
                </span>
              </p>
              <span className="font-semibold text-sm text-indigo-500">
                {formatMoney(cashflows?.total_plan, false)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center flex-row-reverse">
          <div className="space-x-2 flex">
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-transparent bg-gray-400 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              value="Filter"
              onClick={() => {
                toggleFilterActive(true);
              }}
            >
              <AdjustmentsHorizontalIcon className="h-5" />
            </button>
            <Button
              href="/cashflow/create"
              locale={locale}
              className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon className="h-5" />
            </Button>
          </div>
        </div>
      </div>
      <InfiniteScroll
        className="mt-3 grid content-start grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        next={async () => {
          let updateScroll = scroll + 20;
          const cashflows = await get({
            ...filter,
            offset: updateScroll,
          });
          let cashflowMapped: MCashflow[] = [];
          cashflowMapped.push(
            ...(cashflowsData ?? []),
            ...(cashflows.data.data?.data ?? []),
          );
          setCashflowsData(cashflowMapped);
          setScroll(updateScroll);
          if (
            cashflowsData?.length != undefined &&
            cashflows?.data?.data?.total_transactions != undefined
          ) {
            if (
              cashflowsData?.length >= cashflows?.data?.data?.total_transactions
            ) {
              setHasMore(false);
            }
          }
        }}
        hasMore={hasMore}
        height={height + "px"}
        dataLength={cashflowsData?.length ?? 0}
        loader={
          <h4 className="text-center lg:col-span-4 sm:col-span-2">
            {dict.common.loading}
          </h4>
        }
        endMessage={
          (cashflowsData?.length ?? 0) > 0 ? (
            <p className="text-center lg:col-span-4 sm:col-span-2">
              <b className="text-gray-600">{dict.common.allDataLoaded}</b>
            </p>
          ) : (
            <EmptyState
              title={dict.cashflow.empty.title}
              description={dict.cashflow.empty.description}
              button={
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={() => {
                    }}
                  >
                    <PlusIcon className="h-5" /> {dict.cashflow.input.add}
                  </Button>
                </div>
              }
            />
          )
        }
      >
        {cashflowsData?.map((cashflow, index) => (
          <CardList
            key={index}
            bgColor={Number(cashflow.type) == 1 ? "bg-red-600" : "bg-green-600"}
            title={
              <div className="flex justify-between flex-row-reverse">
                {cashflow.type == 1 ? (
                  <p className="text-red-600">
                    -{formatMoney(cashflow.nominal)}
                  </p>
                ) : (
                  <p className="text-green-600">
                    +{formatMoney(cashflow.nominal)}
                  </p>
                )}
              </div>
            }
            icon={
              Number(cashflow.type) == 1 ? (
                <ArrowRightOnRectangleIcon className="w-6" />
              ) : Number(cashflow.type) == 2 ? (
                <ArrowLeftOnRectangleIcon className="w-6" />
              ) : (
                <ArrowsRightLeftIcon className="w-6" />
              )
            }
            details={[
              <span key={1} className="font-semibold">{cashflow.budget_name}</span>,
              cashflow.date,
              <span key={2} className="flex">
                {cashflow.account_name}{" "}
                {cashflow.type == 3 ? (
                  <>
                    {" "}
                    <ArrowRightIcon className="h-4 mx-1" />{" "}
                    {cashflow.account_target_name}
                  </>
                ) : (
                  ""
                )}
              </span>,
              <span key={3} className="italic break-words">{cashflow.notes}</span>,
            ]}
            onClick={async () => {
              router?.push(`/${locale}/cashflow/${cashflow.id}`);
            }}
          />
        ))}
      </InfiniteScroll>

      <Modal
        open={isOpenFilter}
        setOpen={(status) => toggleFilterActive(status)}
        title={dict.cashflow.filter.title}
      >
        <FormFilter initialFilter={filter} dict={dict} />
      </Modal>
    </>
  );
};

const Cashflow = (props: IRecord) => {
  return (
    <Layout>
      <List {...props} />
    </Layout>
  );
};

export default Cashflow;
