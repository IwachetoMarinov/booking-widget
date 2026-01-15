import CustomerPage from "@/src/pages/CustomerPage";

export default async function Customer() {
  return (
    <main className="min-h-screen bg-white p-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-xl font-semibold">Elevatione Customer Page</h1>
        <CustomerPage />
      </div>
    </main>
  );
}
