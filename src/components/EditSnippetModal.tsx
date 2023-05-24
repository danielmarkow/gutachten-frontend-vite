import { Fragment } from "react";

import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useMutation } from "react-query";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import LoadinButton from "./common/LoadingButton";

const schema = z.object({
  oberpunkt: z.string(),
  unterpunkt: z.string(),
});

type FormValues = {
  oberpunkt: string;
  unterpunkt: string;
};

export default function EditSnippetModal({
  open,
  setOpen,
  themeId,
}: {
  open: boolean;
  setOpen: (arg: boolean) => void;
  themeId: string;
}) {
  const [location, setLocation] = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

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
                  {themeId}
                  <div className="px-2">
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
