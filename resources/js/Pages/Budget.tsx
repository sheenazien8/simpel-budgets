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
  PlusIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { EmptyState } from "../Components/EmptyState";
import FormData from "../Components/Bugets/FormData";
import FormFilter from "../Components/Bugets/FormFilter";
import { Inertia } from "@inertiajs/inertia";
import FormCopy from "../Components/Bugets/FormCopy";
import Button from "../Components/Button";

interface IRecord {}

const List = () => {
  const { get, create, detail, update, destroy, copy } = useBudgetAction();
  const { get: getMonth } = useMonthAction();
  const [budgets, setBudgets] = useState<ResponseGetMBudget>();
  const [months, setMonths] = useState<MMonth[]>();
  const [updated, setUpdated] = useState<boolean>(false);
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-modal");
  const [isFilterOpen, toggleFilterActive] =
    useHashRouteToggle("#opened-filter");
  const [isMarkCheckboxOpen, toggleMarkOpen] =
    useHashRouteToggle("#opened-checkbox");
  const [isCopyOpen, toggleCopyOpen] = useState(false);
  const [filter, setFilter] = useState<FBudget>();
  const [editData, setEditData] = useState<MBudget>();
  const [errors, setErrors] = useState<RBudget>();
  const [checkedsId, setCheckedsId] = useState<number[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

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
    setLoadingSubmit(true);
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
        setLoadingSubmit(false);
        toggleActive(false);
        setUpdated(!updated);
        setEditData(undefined);
      },
      () => setLoadingSubmit(false),
    );
  };

  const onCopy = async (values: RBudget) => {
    setLoadingSubmit(true);
    toastProgress(
      copy({ ...values, ids: checkedsId }, setErrors),
      "Menyalin anggaran",
      () => {
        setLoadingSubmit(false);
        toggleActive(false);
        setUpdated(!updated);
        setEditData(undefined);
        toggleCopyOpen(false);
        toggleMarkOpen(false);
      },
      () => setLoadingSubmit(false),
    );
  };

  const onDelete = async () => {
    setLoadingDelete(true);
    if (editData?.id != undefined) {
      toastProgress(
        destroy(editData?.id),
        `Menghapus anggaran`,
        () => {
          setLoadingDelete(false);
          toggleActive(false);
          setUpdated(!updated);
          setEditData(undefined);
        },
        () => setLoadingDelete(false),
      );
    }
  };

  const onFilter = async (values: FBudget) => {
    setLoadingSubmit(true);
    setFilter(values);
    const budgets = await get(values);
    setBudgets(budgets.data.data);
    toggleFilterActive(false);
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
          <div
            className="overflow-y-scroll h-12 flex items-center gap-x-2"
            style={{ direction: "rtl" }}
          >
            <Button
              type="button"
              onClick={() => {
                toggleActive(true);
                setEditData(undefined);
              }}
            >
              <PlusIcon className="h-5" />
            </Button>
            <Button
              type="button"
              color="secondary"
              onClick={() => {
                toggleFilterActive(true);
                setEditData(undefined);
              }}
            >
              <AdjustmentsHorizontalIcon className="h-5" />
            </Button>
            <Button
              type="button"
              color="secondary"
              onClick={() => {
                toggleMarkOpen(!isMarkCheckboxOpen);
              }}
            >
              <Cog6ToothIcon className="h-5" />
            </Button>
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
                className={classNames(
                  isMarkCheckboxOpen ? "w-11/12" : "w-full",
                )}
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
                        "break-words",
                      )}
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
          loadingSubmit={loadingSubmit}
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
          loadingSubmit={loadingSubmit}
          loadingDelete={loadingDelete}
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
        <FormCopy
          onSubmit={onCopy}
          months={months ?? []}
          errors={errors}
          loadingSubmit={loadingSubmit}
        />
      </Modal>
    </>
  );
};

const Budget = (props: IRecord) => {
  return (
    <Layout
      title="Anggaran"
      description={
        <p className="flex items-center gap-x-2 bg-yellow-500 text-white p-1 border rounded-md">
          <ExclamationTriangleIcon className="w-6" />
          Anggaran yang nampil itu di bulan sekarang jika tidak difilter!
        </p>
      }
    >
      <List {...props} />
    </Layout>
  );
};

export default Budget;
