import React, { useEffect, useRef, useState } from "react";
import Layout from "../Components/Layout";
import CardList from "../Components/List";
import Modal from "../Components/Modal";
import {
  classNames,
  encodeQuery,
  formatMoney,
  resolveQueryParameter,
  toastProgress,
  useHashRouteToggle,
} from "../utils/helper";
import { useBudgetAction, useMonthAction } from "../actions";
import {
  FBudget,
  MBudget,
  MMonth,
  RBudget,
  ResponseGetMBudget,
} from "../models";
import {
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
  ClipboardDocumentIcon,
  CogIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  TrashIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { EmptyState } from "../Components/EmptyState";
import FormData from "../Components/Bugets/FormData";
import FormFilter from "../Components/Bugets/FormFilter";
import { Inertia } from "@inertiajs/inertia";
import FormCopy from "../Components/Bugets/FormCopy";

interface IRecord {}

const List = () => {
  const { get, create, detail, update, destroy, copy } = useBudgetAction();
  const { get: getMonth } = useMonthAction();
  const [budgets, setBudgets] = useState<ResponseGetMBudget>();
  const [months, setMonths] = useState<MMonth[]>();
  const [updated, setUpdated] = useState<boolean>(false);
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-modal");
  const [isSettingFilterOpen, toggleFilterOpen] = useHashRouteToggle("#opened-setting-filter");
  const [isFilterOpen, toggleFilterActive] =
    useHashRouteToggle("#opened-filter");
  const [isMarkCheckboxOpen, toggleMarkOpen] =
    useHashRouteToggle("#opened-checkbox");
  const [isDeleteOpen, toggleDeleteOpen] =
    useHashRouteToggle("#deleted-checkbox");
  const [isCopyOpen, toggleCopyOpen] = useState(false);
  const [filter, setFilter] = useState<FBudget>();
  const [editData, setEditData] = useState<MBudget>();
  const [errors, setErrors] = useState<RBudget>();
  const [checkedsId, setCheckedsId] = useState<number[]>([]);

  const load = async () => {
    const params = resolveQueryParameter(location.search);
    const filters: FBudget = {
      month_id: params.get("month_id") ?? "",
      plan: params.get("plan") ?? "",
      current_activated: Number(params.get("current_activated") == "1"),
    };
    setFilter(filters);
    const budgets = await get(filters);
    setBudgets(budgets.data.data);
    const months = await getMonth({
      name: "",
      year: "",
      status: Boolean(Number(1)),
    });
    setMonths(months.data.data);
    toggleFilterActive(false);
    toggleActive(false);
  };

  const onSubmit = async (values: RBudget) => {
    let progess: any;
    if (!editData?.id) {
      progess = create(values, setErrors);
    } else {
      progess = update(editData.id, values, setErrors);
    }
    toastProgress(
      progess,
      `${!editData?.id ? "Pembuatan" : "Perubahan"} anggaran`,
      () => {
        toggleActive(false);
        setUpdated(!updated);
        setEditData(undefined);
      },
    );
  };

  const onCopy = async (values: RBudget) => {
    toastProgress(
      copy({ ...values, ids: checkedsId }, setErrors),
      "Menyalin anggaran",
      () => {
        toggleActive(false);
        setUpdated(!updated);
        setEditData(undefined);
        toggleCopyOpen(false);
        toggleMarkOpen(false);
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

  const onFilter = async (values: FBudget) => {
    setFilter(values);
    const budgets = await get(values);
    setBudgets(budgets.data.data);
    Inertia.visit(`?${encodeQuery(values)}`);
  };

  const onClearFilter = async () => {
    setFilter(undefined);
    setUpdated(!updated);
    toggleFilterActive(false);
    Inertia.visit("/budgets");
  };

  const checkboxRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    load();
  }, [updated]);

  useEffect(() => {
    console.log(checkedsId);
  }, [checkedsId]);

  useEffect(() => {
    if (!isMarkCheckboxOpen) {
      setCheckedsId([]);
    }
  }, [isMarkCheckboxOpen]);

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium text-gray-500">
            Total budget{" "}
            <span className="font-bold">
              {" "}
              {formatMoney(budgets?.total_nominal_budgets)}{" "}
            </span>
          </h2>
          <div className="overflow-y-scroll h-12 flex items-center gap-x-2" style={{ direction: "rtl" }}>
            {/* <button
              type="button"
              className="inline-flex items-center rounded-lg border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              value="Filter"
              onClick={() => {
                toggleDeleteOpen(!isDeleteOpen);
              }}
            >
              <TrashIcon className="h-5" />
            </button> */}
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
              className="inline-flex items-center rounded-lg border border-transparent bg-gray-400 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              value="Filter"
              onClick={() => {
                toggleMarkOpen(!isMarkCheckboxOpen);
              }}
            >
              <Cog6ToothIcon className="h-5" />
            </button>
          </div>
        </div>
        {isMarkCheckboxOpen && checkedsId.length > 0 && (
          <div className="mt-3">
            <div
              className="overflow-y-scroll h-12 flex items-center gap-x-2"
              style={{ whiteSpace: "nowrap" }}
            >
              {
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  value="Tambah"
                  onClick={() => {
                    toggleCopyOpen(true);
                  }}
                >
                  <ClipboardDocumentListIcon className="h-5" /> Salin ke bulan
                  lain
                </button>
              }
              {/* <button
                type="button"
                className="inline-flex items-center rounded-lg border border-transparent bg-gray-400 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                value="Tambah"
                onClick={() => {
                  checkboxRef.current.forEach((el) => {
                    // el.checked = true;
                    console.log(el.checked);
                  });
                }}
              >
                Pilih semua
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-lg border border-transparent bg-gray-400 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                value="Tambah"
                onClick={() => {}}
              >
                Pilih semua berdasarkan filter
              </button> */}
            </div>
          </div>
        )}
        <ul
          role="list"
          className="mt-3 grid grid-cols-1 content-start gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 h-[550px] overflow-x-scroll"
        >
          {budgets?.data?.length == 0 && (
            <EmptyState
              title="Data anggaran kosong"
              description="Persiapkan anggaran!"
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
                  <PlusIcon className="h-5" /> Tambah Anggaran
                </button>
              }
            />
          )}
          {budgets?.data?.map((budget, index) => (
            <div className="flex w-full">
              {isMarkCheckboxOpen && (
                <div className="w-1/12 flex items-center">
                  <input
                    ref={(element) => {
                      if (checkboxRef.current != undefined && element) {
                        checkboxRef.current[index] = element;
                      }
                    }}
                    type="checkbox"
                    onChange={() => {
                      if (!checkedsId.includes(budget.id)) {
                        setCheckedsId([...checkedsId, budget.id]);
                      } else {
                        setCheckedsId(
                          checkedsId.filter((checked) => checked !== budget.id),
                        );
                      }
                    }}
                    className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                  />
                </div>
              )}
              <div
                className={classNames(isMarkCheckboxOpen ? "w-11/12" : "w-full")}
              >
                <CardList
                  key={index}
                  title={budget.plan}
                  icon={<CurrencyDollarIcon className="w-6" />}
                  details={[
                    budget.month,
                    <p
                      className={classNames(
                        Number(budget.transactions_sum_nominal) >
                          Number(budget.nominal) && "text-yellow-600",
                      "break-words")}
                    >
                      {formatMoney(budget.transactions_sum_nominal)} /{" "}
                      {formatMoney(budget.nominal)}
                    </p>,
                  ]}
                  onClick={async () => {
                    const budgetsData = await detail(budget.id);
                    toggleActive(true);
                    setEditData(budgetsData.data.data);
                    setErrors(undefined);
                  }}
                />
              </div>
            </div>
          ))}
        </ul>
      </div>
      <Modal
        open={isFilterOpen}
        setOpen={(status) => toggleFilterActive(status)}
        title="Filter"
      >
        <FormFilter
          onSubmit={onFilter}
          onClear={onClearFilter}
          initialFilter={filter}
          months={months ?? []}
        />
      </Modal>
      <Modal
        open={isOpen}
        setOpen={(status) => toggleActive(status)}
        title={editData ? "Ubah Anggaran" : "Tambah Anggaran"}
      >
        <FormData
          initialValues={
            editData ?? {
              month_id: filter?.month_id,
              plan: filter?.plan,
            }
          }
          errors={errors}
          onSubmit={onSubmit}
          onDelete={onDelete}
          months={months ?? []}
        />
      </Modal>
      <Modal
        open={isCopyOpen}
        setOpen={(status) => toggleCopyOpen(status)}
        title="Pilih bulan untuk menyalin anggaran"
      >
        <FormCopy onSubmit={onCopy} months={months ?? []} errors={errors} />
      </Modal>
    </>
  );
};

const Budget = (props: IRecord) => {
  return (
    <Layout title="Anggaran">
      <List {...props} />
    </Layout>
  );
};

export default Budget;
