// this will be a button in the dashboard
export default function Home() {
  return (
    <>
      <form
        action={async () => {
          "use server";
          await fetch("http://localhost:3000/api/batch/import", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          });
        }}
      >
        <button type="submit">Call import</button>
      </form>
    </>
  );
}
