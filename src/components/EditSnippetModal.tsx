import { Fragment, useEffect, useState } from "react";

import axios from "axios";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
// import { useLocation } from "wouter";
import { useMutation } from "react-query";
import {
  XMarkIcon,
  ChevronUpDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import LoadinButton from "./common/LoadingButton";
import type { ThemeInput, ThemeOutput } from "../types/textbausteine";
import { Square2StackIcon } from "@heroicons/react/20/solid";

const schema = z.object({
  oberpunkt: z.string(),
  unterpunkt: z.string(),
  farbe: z.object({
    name: z.string(),
    value: z.string(),
    twind: z.string(),
  }),
});

type Color = {
  name: string;
  value: string;
  twind: string;
};

type FormValues = {
  oberpunkt: string;
  unterpunkt: string;
  farbe: Color;
};

const COLOR_LIST = [
  { name: "Slate", value: "#94a3b8", twind: "fill-slate-400" },
  { name: "Rot", value: "#f87171", twind: "fill-red-400" },
  { name: "Stein", value: "#a8a29e", twind: "fill-stone-400" },
  { name: "Orange", value: "#fb923c", twind: "fill-orange-400" },
  { name: "Amber", value: "#fbbf24", twind: "fill-amber-400" },
  { name: "Gelb", value: "#facc15", twind: "fill-yellow-400" },
  { name: "Himmelblau", value: "#0ea5e9", twind: "fill-sky-400" },
] as Color[];

export default function EditSnippetModal({
  open,
  setOpen,
  theme,
}: {
  open: boolean;
  setOpen: (arg: boolean) => void;
  theme: ThemeOutput;
}) {
  const [selectedColor, setSelectedColor] = useState<Color>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const currentColor = COLOR_LIST.filter(
      (color) => color.value === theme.color
    )[0];
    // set values in the form on initial render
    reset({
      oberpunkt: theme.theme,
      unterpunkt: theme.differentiation,
      farbe: currentColor,
    });
    setSelectedColor(currentColor);
  }, [open]);

  const updateThemeMut = useMutation({
    mutationFn: async ({
      themeId,
      payload,
    }: {
      themeId: string;
      payload: ThemeInput;
    }) => {
      const res = await axios.put(
        "http://localhost:8000/api/theme/" + themeId,
        payload
      );
      return res.data;
    },
    onError: () => {
      console.error("Beim Speichern ist ein Fehler aufgetreten");
    },
  });

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* {JSON.stringify(theme)} */}
                  <div className="px-2">
                    <div className="mb-1">
                      <Controller
                        control={control}
                        name="farbe"
                        render={({ field }) => (
                          <Listbox
                            onChange={(e) => {
                              field.onChange(e);
                              setSelectedColor(e);
                            }}
                            value={selectedColor}
                          >
                            {({ open }) => (
                              <>
                                <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                                  Farbe
                                </Listbox.Label>
                                <div className="relative mt-2">
                                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                    <span className="block truncate">
                                      <div className="flex align-middle gap-1">
                                        <Square2StackIcon
                                          className={`h-5 w-5 ${selectedColor?.twind}`}
                                        />{" "}
                                        {selectedColor?.name}
                                      </div>
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                      <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </Listbox.Button>
                                  <Transition
                                    show={open}
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                  >
                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {COLOR_LIST.map((color, i) => (
                                        <Listbox.Option
                                          key={i}
                                          className={({ active }) =>
                                            classNames(
                                              active
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-900",
                                              "relative cursor-default select-none py-2 pl-3 pr-9"
                                            )
                                          }
                                          value={color}
                                        >
                                          {({ selected, active }) => (
                                            <>
                                              <div className="flex align-middle gap-1">
                                                <Square2StackIcon
                                                  className={`h-5 w-5 ${color.twind}`}
                                                />
                                                <p
                                                  className={classNames(
                                                    selected
                                                      ? "font-semibold"
                                                      : "font-normal",
                                                    "block truncate"
                                                  )}
                                                >
                                                  {color.name}
                                                </p>
                                              </div>

                                              {selected ? (
                                                <span
                                                  className={classNames(
                                                    active
                                                      ? "text-white"
                                                      : "text-indigo-600",
                                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                                  )}
                                                >
                                                  <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                  />
                                                </span>
                                              ) : null}
                                            </>
                                          )}
                                        </Listbox.Option>
                                      ))}
                                    </Listbox.Options>
                                  </Transition>
                                </div>
                              </>
                            )}
                          </Listbox>
                        )}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="oberpunkt"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Oberpunkt
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="oberpunkt"
                          className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          {...register("oberpunkt")}
                        />
                        {errors && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="description-error"
                          >
                            {errors.oberpunkt?.message as string}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="unterpunkt"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Unterpunkt
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="unterpunkt"
                          className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          rows={5}
                          {...register("unterpunkt")}
                        />
                        {errors && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="description-error"
                          >
                            {errors.unterpunkt?.message as string}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                    >
                      {/* {createGutachtenMut.isLoading ? (
                        <LoadinButton />
                      ) : (
                        "Gutachten erstellen"
                      )} */}
                      Speichern
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                    >
                      Abbrechen
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
