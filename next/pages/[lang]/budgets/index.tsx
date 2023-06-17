import React, { useEffect, useRef, useState } from "react";
import {
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";
import { useBudgetAction } from "@/actions";
import { FBudget, MBudget, RBudget, ResponseGetMBudget } from "@/models";
import {
  classNames,
  encodeQuery,
  formatMoney,
  resolveQueryParameter,
  toastProgress,
  useHashRouteToggle,
} from "@/utils/helper";
import { Button, CardList, EmptyState, Layout, Modal } from "@/ui";
import FormData from "@/components/budgets/form-data";
import FormCopy from "@/components/budgets/form-copy";
import FormFilter from "@/components/budgets/form-filter";
import { useRouter } from "next/router";

interface IRecord {}

const List = () => {
  const { get, create, detail, update, destroy, copy } = useBudgetAction();
  const [budgets, setBudgets] = useState<ResponseGetMBudget>();
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
  const router = useRouter();

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
        load();
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
        load();
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
          load();
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
    setLoadingSubmit(false);
    router.replace(`?${encodeQuery(values)}`);
  };

  const onClearFilter = async () => {
    setFilter(undefined);
    load();
    toggleFilterActive(false);
    router.push(``);
  };

  const checkboxRef = useRef<HTMLInputElement[]>([]);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    load();
  }, [router]);

  useEffect(() => {}, [checkedsId]);

  useEffect(() => {
    if (!isMarkCheckboxOpen) {
      setCheckedsId([]);
    }
  }, [isMarkCheckboxOpen]);

  useEffect(() => {
    setHeight(document?.documentElement?.offsetHeight - 310);
  }, []);

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
            </div>
          </div>
        )}
        <ul
          role="list"
          className={`mt-3 grid grid-cols-1 content-start gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 overflow-x-scroll`}
          style={{ height: height }}
        >
          {budgets?.data?.length == 0 && (
            <EmptyState
              title="Data anggaran kosong"
              description="Persiapkan anggaran!"
              button={
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={() => {
                      toggleActive(true);
                      setEditData(undefined);
                    }}
                  >
                    <PlusIcon className="h-5" /> Tambah Anggaran
                  </Button>
                </div>
              }
            />
          )}
          {budgets?.data?.map((budget, index) => (
            <div className="flex w-full" key={index}>
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
                  bgColor={
                    String(budget.type) === "2" ? "bg-green-600" : undefined
                  }
                  title={budget.plan}
                  icon={
                    String(budget.type) === "1" ? (
                      <CurrencyDollarIcon className="w-6" />
                    ) : (
                      <CreditCardIcon className="w-6" />
                    )
                  }
                  details={[
                    budget.month,
                    <p
                      key={index}
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
        />
      </Modal>
      <Modal
        open={isCopyOpen}
        setOpen={(status) => toggleCopyOpen(status)}
        title="Pilih bulan untuk menyalin anggaran"
      >
        <FormCopy
          onSubmit={onCopy}
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
        <div className="flex items-center gap-x-2 bg-yellow-500 text-white p-1 border rounded-md">
          <ExclamationTriangleIcon className="w-6" />
          <p>Anggaran yang nampil itu di bulan sekarang jika tidak difilter!</p>
        </div>
      }
    >
      <List {...props} />
    </Layout>
  );
};

export default Budget;
