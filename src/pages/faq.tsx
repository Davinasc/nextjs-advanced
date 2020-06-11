import { GetStaticProps } from "next";
import { openDB } from "src/openDB";
import { FaqModel } from "@/models/Faq";

interface FaqProps {
  faq: FaqModel[];
}

export default function Faq({ faq }: FaqProps) {
  return (
    <div>
      {faq.map(({ id, answer, question }) => (
        <div key={id}>
          <p>Q: {question}</p>
          <p>A: {answer}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const db = await openDB();
  const faq = await db.all("SELECT * FROM FAQ ORDER BY createDate DESC");
  return { props: { faq } };
};
