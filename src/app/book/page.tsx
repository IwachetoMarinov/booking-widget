import Bookpage from "@/src/views/Bookpage";

export default async function BookPage() {
  return (
    <main className="min-h-screen bg-white p-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-xl font-semibold">Elevatione Booking Page</h1>
        <Bookpage />
      </div>
    </main>
  );
}
