export default function ProductReviews() {

  return (

    <section className="mt-32">

      <h2 className="font-serif text-5xl">
        Customer Reviews
      </h2>

      <div className="mt-12 space-y-8">

        <div className="rounded-3xl border border-[#222] bg-[#090909] p-8">

          <h3 className="text-xl font-semibold">
            James M.
          </h3>

          <p className="mt-4 text-gray-400">
            Amazing quality. The fabric feels premium
            and the fit is exactly what I wanted.
          </p>

        </div>

        <div className="rounded-3xl border border-[#222] bg-[#090909] p-8">

          <h3 className="text-xl font-semibold">
            Brian K.
          </h3>

          <p className="mt-4 text-gray-400">
            Definitely luxury. Worth every shilling.
          </p>

        </div>

      </div>

    </section>

  );

}