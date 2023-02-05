import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import {
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import CardList from "../Components/List";
import Modal from "../Components/Modal";
import {
  encodeQuery,
  formatMoney,
  resolveQueryParameter,
  toastProgress,
  useHashRouteToggle,
} from "../utils/helper";
import {
  useAccountAction,
  useBudgetAction,
  useCashflowAction,
} from "../actions";
import {
  MAccount,
  MCashflow,
  RCashflow,
  ResponseGetMBudget,
  ResponseGetMCashflow,
} from "../models";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { EmptyState } from "../Components/EmptyState";
import FormData from "./../Components/Cashflow/FormData";
import FormFilter from "./../Components/Cashflow/FormFilter";
import { Inertia } from "@inertiajs/inertia";
import InfiniteScroll from "react-infinite-scroll-component";

interface IRecord {}

const List = () => {
  const { get, create, detail, update, destroy } = useCashflowAction();
  const { get: getAccount } = useAccountAction();
  const { get: getBudget } = useBudgetAction();
  const [cashflows, setCashflows] = useState<ResponseGetMCashflow>();
  const [cashflowsData, setCashflowsData] = useState<MCashflow[]>();
  const [accounts, setAccounts] = useState<MAccount[]>();
  const [budgets, setBudgets] = useState<ResponseGetMBudget>();
  const [updated, setUpdated] = useState<boolean>(false);
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-modal");
  const [isOpenFilter, toggleFilterActive] =
    useHashRouteToggle("#opened-filter");
  const [filter, setFilter] = useState<RCashflow>();
  const [editData, setEditData] = useState<MCashflow>();
  const [errors, setErrors] = useState<RCashflow>();
  const [scroll, setScroll] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const onSubmit = async (values: RCashflow) => {
    values.budget_id = ![2, 3].includes(Number(values.type))
      ? values.budget_id
      : undefined;
    let progess: any;
    if (!editData?.id) {
      progess = create(values, setErrors);
    } else {
      progess = update(editData.id, values, setErrors);
    }
    toastProgress(
      progess,
      `${!editData?.id ? "Pembuatan" : "Perubahan"} cashflow`,
      () => {
        toggleActive(false);
        setUpdated(!updated);
        setEditData(undefined);
      },
    );
  };

  const onDelete = async () => {
    if (editData?.id != undefined) {
      toastProgress(destroy(editData?.id), `Menghapus anggaran`, () => {
        toggleActive(false);
        setUpdated(!updated);
        setEditData(undefined);
      });
    }
  };

  const onFilter = async (values: RCashflow) => {
    values.budget_id = ![2, 3].includes(Number(values.type))
      ? values.budget_id
      : "";
    setFilter(values);
    const budgetss = await get(values);
    setCashflows(budgetss.data.data);
    setCashflowsData(budgetss.data.data?.data);
    Inertia.visit(`?${encodeQuery(values)}`);
  };

  const onClearFilter = async () => {
    setFilter(undefined);
    setUpdated(!updated);
    toggleFilterActive(false);
    Inertia.visit("/cashflow");
  };

  const load = async () => {
    const params = resolveQueryParameter(location.search);
    const filters: RCashflow = {
      account_id: params.get("account_id") ?? "",
      account_target: params.get("account_target") ?? "",
      budget_id: params.get("budget_id") ?? "",
      notes: params.get("notes") ?? "",
      date: params.get("date") ?? "",
      type: params.get("type") ?? "",
    };
    setFilter(filters);
    const cashflows = await get(filters);
    setCashflows(cashflows.data.data);
    setCashflowsData(cashflows.data.data?.data);
    const accounts = await getAccount();
    setAccounts(accounts.data.data?.data);
    const budgets = await getBudget();
    setBudgets(budgets.data.data);
    toggleFilterActive(false);
    toggleActive(false);
    if (cashflows.data.data?.data.length == (cashflowsData?.length ?? 0)) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    load();
  }, [updated]);

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium text-gray-500">
            Total pengeluaran bulan ini{" "}
            <span className="font-bold">
              {" "}
              {formatMoney(cashflows?.transaction_sum_nominal)}{" "}
            </span>
          </h2>
          <div className="space-x-2 flex">
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-transparent bg-gray-400 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              value="Filter"
              onClick={() => {
                toggleFilterActive(true);
                setEditData(undefined);
              }}
            >
              <AdjustmentsHorizontalIcon className="h-5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              value="Tambah"
              onClick={() => {
                toggleActive(true);
                setEditData(undefined);
              }}
            >
              <PlusIcon className="h-5" />
            </button>
          </div>
        </div>
      </div>
      <InfiniteScroll
        className="mt-3 grid content-start grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        next={async () => {
          let updateScroll = scroll + 20;
          const cashflows = await get({
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
        height="550px"
        dataLength={cashflowsData?.length ?? 0}
        loader={
          <h4 className="text-center lg:col-span-4 sm:col-span-2">
            Loading...
          </h4>
        }
        endMessage={
          (cashflowsData?.length ?? 0) > 0 ? (
            <p className="text-center lg:col-span-4 sm:col-span-2">
              <b className="text-gray-600">Data sudah tampil semua</b>
            </p>
          ) : (
            <EmptyState
              title="Arus keuangan anda kosong"
              description="Catat semua pengeluaran anda, better cash flow better life"
              button={
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  value="Tambah"
                  onClick={() => {
                    toggleActive(true);
                    setEditData(undefined);
                  }}
                >
                  <PlusIcon className="h-5" /> Catat arus kas keuangan anda
                </button>
              }
            />
          )
        }
      >
        {cashflowsData?.map((cashflow, index) => (
          <CardList
            key={index}
            title={
              <div className="flex justify-between">
                <p>{cashflow.budget_name}</p>
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
            icon={<CurrencyDollarIcon className="w-6" />}
            details={[
              cashflow.date,
              <span className="flex">
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
              <span className="italic break-words">{cashflow.notes}</span>,
            ]}
            onClick={async () => {
              const cashflowData = await detail(cashflow.id);
              toggleActive(true);
              setEditData(cashflowData.data.data);
              setErrors(undefined);
            }}
          />
        ))}
      </InfiniteScroll>

      <Modal
        open={isOpenFilter}
        setOpen={(status) => toggleFilterActive(status)}
        title="Filter"
      >
        <FormFilter
          accounts={accounts ?? []}
          budgets={budgets?.data ?? []}
          onSubmit={onFilter}
          onClear={onClearFilter}
          initialFilter={filter}
        />
      </Modal>
      <Modal
        open={isOpen}
        setOpen={(status) => toggleActive(status)}
        title={editData ? "Perbaharui arus kas anda" : "Catat arus kas anda"}
      >
        <FormData
          initialValues={editData ?? filter}
          onSubmit={onSubmit}
          errors={errors}
          accounts={accounts ?? []}
          budgets={budgets?.data ?? []}
          onDelete={onDelete}
        />
      </Modal>
    </>
  );
};

const Cashflow = (props: IRecord) => {
  return (
    <Layout title="Cashflow">
      <List {...props} />
    </Layout>
  );
};

export default Cashflow;
