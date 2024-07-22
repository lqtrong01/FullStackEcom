import React from "react";

export default function PageComponent({ title, search="",buttons = "", children }) {
  return (
    <>
      <header className="bg-white shadow sticky -top-5 z-5 ">
        <div className="flex justify-between items-center mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
          <div className="sm:w-24 lg:w-60">{search}</div>
          {buttons}
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </>
  );
}