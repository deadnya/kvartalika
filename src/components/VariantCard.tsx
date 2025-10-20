import type { VariantRequest } from "../services";

const statusMap: Record<string, { label: string; color: string }> = {
    AVAILABLE: { label: "В продаже", color: "bg-green-100 text-green-700" },
    RESERVED: { label: "Забронировано", color: "bg-amber-100 text-amber-700" },
    SOLD: { label: "Продано", color: "bg-red-100 text-red-700" },
};

function cx(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(" ");
}

export function VariantCard({
                                price,
                                status,
                                area,
                                floor,
                                id,
                            }: VariantRequest) {
    const st = statusMap[status] ?? {
        label: status,
        color: "bg-gray-100 text-gray-600",
    };

    return (
        <article
            className="group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-4 flex flex-col gap-3"
        >
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-gray-900">
                    Вариант #{id}
                </h3>
                <span
                    className={cx(
                        "inline-block px-2 py-1 rounded-md text-[11px] font-medium leading-none",
                        st.color
                    )}
                >
          {st.label}
        </span>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">
                    {price.toLocaleString("ru-RU")} ₽
                </div>
            </div>

            <div className="flex items-center justify-between text-[13px] text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-1">
                    <svg
                        className="w-4 h-4 text-primary-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path d="M4 12h16M4 18h16M4 6h16" strokeLinecap="round" />
                    </svg>
                    <span>{area} м²</span>
                </div>
                <div className="w-px h-4 bg-gray-300" />
                <div className="flex items-center gap-1">
                    <svg
                        className="w-4 h-4 text-primary-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path d="M8 20V4m8 16V4M4 20h16" strokeLinecap="round" />
                    </svg>
                    <span>Этаж {floor}</span>
                </div>
            </div>
        </article>
    );
}
