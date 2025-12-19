import { useState, useEffect } from "react";
import api from "../../api/api";
import toast, { Toaster } from "react-hot-toast";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MenuManager() {
    const [day, setDay] = useState("Monday");

    const [menu, setMenu] = useState({
        breakfastItems: [],
        snacksItems: [],
        lunch: [],
        dinner: [],
        specialItems: { lunch: [], dinner: [] }
    });

    /* ---------- IMAGE ITEM HANDLERS ---------- */

    const addImageItem = (section) => {
        setMenu({ ...menu, [section]: [...menu[section], { name: "", img: "", public_id: "" }] });
    };

    const removeImageItem = async (section, index) => {
        const item = menu[section][index];
        try {
            if (item.public_id) {
                await api.delete("/upload", { data: { public_id: item.public_id } });
            }
            const updated = menu[section].filter((_, i) => i !== index);
            setMenu({ ...menu, [section]: updated });
            toast.success("Item removed successfully");
        } catch {
            toast.error("Failed to delete image");
        }
    };

    const updateImageItem = (section, index, field, value) => {
        const updated = [...menu[section]];
        updated[index][field] = value;
        setMenu({ ...menu, [section]: updated });
    };

    /* ---------- TEXT ITEM HANDLERS ---------- */

    const addTextItem = (section) => {
        setMenu({ ...menu, [section]: [...menu[section], ""] });
    };

    const updateTextItem = (section, index, value) => {
        const updated = [...menu[section]];
        updated[index] = value;
        setMenu({ ...menu, [section]: updated });
    };

    const removeTextItem = (section, index) => {
        const updated = menu[section].filter((_, i) => i !== index);
        setMenu({ ...menu, [section]: updated });
        toast.success("Item removed");
    };

    /* ---------- SPECIAL ITEMS ---------- */

    const addSpecialItem = (type) => {
        setMenu({
            ...menu,
            specialItems: {
                ...menu.specialItems,
                [type]: [...menu.specialItems[type], ""]
            }
        });
    };

    const updateSpecialItem = (type, index, value) => {
        const updated = [...menu.specialItems[type]];
        updated[index] = value;
        setMenu({ ...menu, specialItems: { ...menu.specialItems, [type]: updated } });
    };

    const removeSpecialItem = (type, index) => {
        const updated = menu.specialItems[type].filter((_, i) => i !== index);
        setMenu({ ...menu, specialItems: { ...menu.specialItems, [type]: updated } });
        toast.success("Item removed");
    };

    /* ---------- UPLOAD ---------- */

    const uploadImage = async (file, section, index) => {
        if (!file) return;
        updateImageItem(section, index, "img", "UPLOADING");

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await api.post("/upload", formData);
            updateImageItem(section, index, "img", res.data.url);
            updateImageItem(section, index, "public_id", res.data.public_id);
            toast.success("Image uploaded");
        } catch {
            updateImageItem(section, index, "img", "");
            updateImageItem(section, index, "public_id", "");
            toast.error("Image upload failed");
        }
    };

    const isUploading = [...menu.breakfastItems, ...menu.snacksItems].some(i => i.img === "UPLOADING");

    const saveMenu = async () => {
        try {
            await api.post(`/menu/${day}`, { ...menu, day });
            toast.success(`${day} menu saved successfully`);
        } catch {
            toast.error("Failed to save menu");
        }
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await api.get(`/menu/${day}`);
                const data = res.data || {};

                setMenu({
                    breakfastItems: Array.isArray(data.breakfastItems) ? data.breakfastItems : [],
                    snacksItems: Array.isArray(data.snacksItems) ? data.snacksItems : [],
                    lunch: Array.isArray(data.lunch) ? data.lunch : [],
                    dinner: Array.isArray(data.dinner) ? data.dinner : [],
                    specialItems: {
                        lunch: Array.isArray(data.specialItems?.lunch) ? data.specialItems.lunch : [],
                        dinner: Array.isArray(data.specialItems?.dinner) ? data.specialItems.dinner : []
                    }
                });
            } catch {
                toast.error("Failed to load menu");
            }
        };
        fetchMenu();
    }, [day]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-green-100 py-10">
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto px-4 space-y-10">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                        Weekly Menu Manager
                    </h1>

                    <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="rounded-xl px-5 py-3 bg-white/80 backdrop-blur border shadow focus:ring-2 focus:ring-green-500"
                    >
                        {days.map(d => <option key={d}>{d}</option>)}
                    </select>
                </div>

                {/* GRID */}
                <Grid>
                    <Card title="Breakfast 🍳">
                        <ImageSection section="breakfastItems" items={menu.breakfastItems}
                            onAdd={() => addImageItem("breakfastItems")}
                            onUpdate={(i, f, v) => updateImageItem("breakfastItems", i, f, v)}
                            onRemove={(i) => removeImageItem("breakfastItems", i)}
                            onUpload={uploadImage}
                        />
                    </Card>

                    <Card title="Snacks 🍪">
                        <ImageSection section="snacksItems" items={menu.snacksItems}
                            onAdd={() => addImageItem("snacksItems")}
                            onUpdate={(i, f, v) => updateImageItem("snacksItems", i, f, v)}
                            onRemove={(i) => removeImageItem("snacksItems", i)}
                            onUpload={uploadImage}
                        />
                    </Card>

                    <Card title="Lunch 🍛">
                        <TextSection items={menu.lunch}
                            onAdd={() => addTextItem("lunch")}
                            onUpdate={(i, v) => updateTextItem("lunch", i, v)}
                            onRemove={(i) => removeTextItem("lunch", i)}
                        />
                    </Card>

                    <Card title="Dinner 🍽️">
                        <TextSection items={menu.dinner}
                            onAdd={() => addTextItem("dinner")}
                            onUpdate={(i, v) => updateTextItem("dinner", i, v)}
                            onRemove={(i) => removeTextItem("dinner", i)}
                        />
                    </Card>

                    <Card title="Special Lunch ⭐">
                        <TextSection items={menu.specialItems.lunch}
                            onAdd={() => addSpecialItem("lunch")}
                            onUpdate={(i, v) => updateSpecialItem("lunch", i, v)}
                            onRemove={(i) => removeSpecialItem("lunch", i)}
                        />
                    </Card>

                    <Card title="Special Dinner 🌙">
                        <TextSection items={menu.specialItems.dinner}
                            onAdd={() => addSpecialItem("dinner")}
                            onUpdate={(i, v) => updateSpecialItem("dinner", i, v)}
                            onRemove={(i) => removeSpecialItem("dinner", i)}
                        />
                    </Card>
                </Grid>

                {/* SAVE BUTTON */}
                <div className="sticky bottom-4 flex justify-end">
                    <button
                        disabled={isUploading}
                        onClick={saveMenu}
                        className={`
                          px-10 py-4 rounded-2xl font-bold text-white
                          shadow-xl transition-all duration-300
                          hover:scale-105 active:scale-95
                          ${isUploading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-green-600 to-emerald-500"}
                        `}
                    >
                        Save {day} Menu
                    </button>
                </div>

            </div>
        </div>
    );
}

/* ---------- UI COMPONENTS ---------- */

const Grid = ({ children }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>
);

const Card = ({ title, children }) => (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border shadow-lg p-6 space-y-5 hover:shadow-2xl transition">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        {children}
    </div>
);

const ImageSection = ({ items, onAdd, onUpdate, onRemove, onUpload, section }) => (
    <div className="space-y-6">
        {items.map((item, index) => (
            <div key={index} className="rounded-2xl bg-white border p-4 space-y-4 hover:shadow-xl transition">
                <input
                    className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-green-400"
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => onUpdate(index, "name", e.target.value)}
                />

                {item.img && item.img !== "UPLOADING" && (
                    <div className="w-full max-w-[220px] h-[180px] rounded-xl overflow-hidden shadow">
                        <img src={item.img} alt="Food" className="w-full h-full object-cover hover:scale-110 transition" />
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <label className="cursor-pointer font-medium text-slate-700 hover:text-green-600">
                        <input type="file" hidden accept="image/*"
                            onChange={(e) => onUpload(e.target.files[0], section, index)} />
                        📤 Upload Image
                    </label>

                    <button
                        onClick={() => onRemove(index)}
                        className="group relative overflow-hidden border-2 border-red-500 px-6 py-1.5 rounded-xl text-red-500 font-semibold hover:text-white transition"
                    >
                        <span className="absolute inset-0 bg-red-500 scale-x-0 group-hover:scale-x-100 origin-left transition"></span>
                        <span className="relative z-10">🗑️ Remove</span>
                    </button>
                </div>
            </div>
        ))}

        <button onClick={onAdd} className="text-green-600 font-semibold hover:text-green-700 transition">
            ➕ Add Item
        </button>
    </div>
);

const TextSection = ({ items, onAdd, onUpdate, onRemove }) => (
    <div className="space-y-4">
        {items.map((item, index) => (
            <div key={index} className="flex gap-2 bg-white border rounded-xl p-2 hover:shadow transition">
                <input
                    className="flex-1 rounded-lg border px-4 py-2 focus:ring-2 focus:ring-green-400"
                    value={item}
                    onChange={(e) => onUpdate(index, e.target.value)}
                />
                <button onClick={() => onRemove(index)} className="text-red-500 font-bold hover:bg-red-100 px-3 rounded-lg">
                    ✕
                </button>
            </div>
        ))}

        <button onClick={onAdd} className="text-green-600 font-semibold hover:text-green-700 transition">
            ➕ Add Item
        </button>
    </div>
);
