import Category from "@/app/components/Category";

export default function Categories() {
  return (
    <div className="flex gap-4">
      <Category value="A" />
      <Category value="B" />
      <Category value="C" />
      <Category value="D" />
    </div>
  );
}