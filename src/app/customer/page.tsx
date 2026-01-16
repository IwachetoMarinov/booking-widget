import CustomerPage from "@/src/views/CustomerPage";

export default async function Customer() {
  return (
    <main className="min-h-screen bg-white p-4">
      <div className="mx-auto max-w-2xl">
        <CustomerPage />
      </div>
    </main>
  );
}
