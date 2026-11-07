import type {
  Access,
  CollectionConfig,
  Field,
  CollectionAfterChangeHook,
} from "payload"

const staff: Access = ({ req }) =>
  req.user?.collection === "admins" ||
  (req.user?.collection === "users" && req.user.role === "admin")
const member: Access = ({ req }) => req.user?.collection === "users"
const owned: Access = ({ req }) => {
  if (
    req.user?.collection === "admins" ||
    (req.user?.collection === "users" && req.user.role === "admin")
  )
    return true
  return req.user?.collection === "users"
    ? { owner: { equals: req.user.id } }
    : false
}
const owner: Field = {
  name: "owner",
  type: "relationship",
  relationTo: "users",
  required: true,
  index: true,
  access: { update: () => false },
  hooks: {
    beforeValidate: [
      ({ req, value, operation }) =>
        operation === "create" && req.user?.collection === "users"
          ? req.user.id
          : value,
    ],
  },
}
const audit: CollectionAfterChangeHook = async ({
  doc,
  req,
  collection,
  operation,
}) => {
  await req.payload.create({
    collection: "audit-events",
    overrideAccess: true,
    req,
    data: {
      actor: req.user
        ? `${req.user.collection}:${req.user.id}`
        : "registration",
      action: operation,
      resource: collection.slug,
      record: String(doc.id),
    },
  })
  return doc
}
const privateCollection = (
  slug: string,
  fields: Field[],
): CollectionConfig => ({
  slug,
  admin: { group: "Usaha", useAsTitle: "name" },
  access: { create: member, read: owned, update: owned, delete: () => false },
  hooks: { afterChange: [audit] },
  fields: [owner, ...fields],
})

export const Users: CollectionConfig = {
  slug: "users",
  auth: { tokenExpiration: 604800, maxLoginAttempts: 5, lockTime: 600000 },
  admin: { group: "Akun", useAsTitle: "name" },
  access: {
    create: () => true,
    read: ({ req }) =>
      req.user?.collection === "admins"
        ? true
        : req.user?.collection === "users"
          ? { id: { equals: req.user.id } }
          : false,
    update: ({ req }) =>
      req.user?.collection === "admins"
        ? true
        : req.user?.collection === "users"
          ? { id: { equals: req.user.id } }
          : false,
    delete: staff,
    admin: () => false,
  },
  hooks: { afterChange: [audit] },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 100 },
    { name: "business", type: "text", maxLength: 100 },
    {
      name: "role",
      type: "select",
      defaultValue: "umkm",
      saveToJWT: true,
      options: ["umkm", "konsultan", "admin"],
      access: {
        create: ({ req }) => req.user?.collection === "admins",
        update: ({ req }) => req.user?.collection === "admins",
      },
    },
  ],
}
export const Transactions = privateCollection("transactions", [
  { name: "name", type: "text", required: true, maxLength: 160 },
  { name: "amount", type: "number", required: true, min: 1, max: 100000000000 },
  {
    name: "kind",
    type: "select",
    options: ["income", "expense"],
    required: true,
  },
  {
    name: "category",
    type: "select",
    required: true,
    options: ["Penjualan", "Restock", "Operasional", "Personal", "Lainnya"],
  },
  { name: "date", type: "date", required: true },
])
export const Products = privateCollection("products", [
  { name: "name", type: "text", required: true, maxLength: 100 },
  { name: "price", type: "number", required: true, min: 1 },
  { name: "cost", type: "number", required: true, min: 0 },
  {
    name: "stock",
    type: "number",
    required: true,
    min: 0,
    validate: (v: number | null | undefined) =>
      Number.isInteger(v) || "Stok harus bilangan bulat",
  },
])
export const Pockets = privateCollection("pockets", [
  { name: "name", type: "text", required: true },
  {
    name: "type",
    type: "select",
    options: ["Bisnis", "Personal"],
    required: true,
  },
  { name: "target", type: "number", min: 1, required: true },
  { name: "allocation", type: "number", min: 0, required: true },
  {
    name: "history",
    type: "array",
    access: { create: () => false, update: () => false },
    fields: [
      { name: "date", type: "date", required: true },
      { name: "allocation", type: "number", required: true },
      { name: "target", type: "number", required: true },
    ],
  },
])
Pockets.hooks = {
  ...Pockets.hooks,
  beforeChange: [({ data, originalDoc, operation }) => {
    const allocation = data.allocation ?? originalDoc?.allocation
    const target = data.target ?? originalDoc?.target
    const history = [...(originalDoc?.history ?? [])]
    if (operation === "create" || allocation !== originalDoc?.allocation || target !== originalDoc?.target) {
      if (operation !== "create" && originalDoc && !history.length) history.push({ date: originalDoc.createdAt, allocation: originalDoc.allocation, target: originalDoc.target })
      history.push({ date: new Date().toISOString(), allocation, target })
    }
    return { ...data, history }
  }],
}
export const Consultants: CollectionConfig = {
  slug: "consultants",
  admin: { group: "Konsultasi", useAsTitle: "name" },
  access: { create: staff, read: () => true, update: staff, delete: staff },
  hooks: {
    afterChange: [audit],
    beforeValidate: [
      ({ data }) => {
        if (
          data?.verified &&
          (!data?.certificate ||
            Number(data?.bootcampDays) < 14 ||
            !data?.education)
        )
          throw new Error(
            "Verifikasi membutuhkan pendidikan FEB, bootcamp 14 hari, dan sertifikat.",
          )
        return data
      },
    ],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "expertise", type: "text", required: true },
    {
      name: "education",
      type: "select",
      options: ["Lulusan FEB", "Mahasiswa akhir FEB"],
      required: true,
    },
    { name: "university", type: "text", required: true },
    { name: "bio", type: "textarea" },
    { name: "bootcampDays", type: "number", defaultValue: 0, min: 0 },
    { name: "certificate", type: "text" },
    { name: "verified", type: "checkbox", defaultValue: false },
    { name: "demo", type: "checkbox", defaultValue: true },
  ],
}
export const Slots: CollectionConfig = {
  slug: "consultation-slots",
  admin: { group: "Konsultasi" },
  access: { create: staff, read: member, update: staff, delete: staff },
  fields: [
    {
      name: "consultant",
      type: "relationship",
      relationTo: "consultants",
      required: true,
    },
    { name: "startsAt", type: "date", required: true },
    { name: "available", type: "checkbox", defaultValue: true },
  ],
}
export const Bookings = privateCollection("bookings", [
  { name: "name", type: "text", required: true },
  {
    name: "slot",
    type: "relationship",
    relationTo: "consultation-slots",
    required: true,
    unique: true,
    access: { update: () => false },
  },
  {
    name: "report",
    type: "textarea",
    access: {
      create: ({ req }) => req.user?.collection === "admins",
      update: ({ req }) => req.user?.collection === "admins",
    },
  },
])
Bookings.hooks = {
  ...Bookings.hooks,
  beforeValidate: [
    async ({ data, req, operation }) => {
      if (operation === "create" && data?.slot) {
        const slot = await req.payload.findByID({
          collection: "consultation-slots",
          id: data.slot,
          depth: 1,
          user: req.user,
          overrideAccess: false,
          req,
        })
        const consultant = slot.consultant
        if (
          !slot.available ||
          new Date(slot.startsAt) <= new Date() ||
          typeof consultant !== "object" ||
          !consultant?.verified ||
          consultant.demo
        )
          throw new Error(
            "Jadwal atau konsultan belum tersedia untuk booking nyata.",
          )
      }
      return data
    },
  ],
}
export const AuditEvents: CollectionConfig = {
  slug: "audit-events",
  admin: { group: "Keamanan" },
  access: {
    create: () => false,
    read: staff,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: "actor", type: "text", required: true },
    { name: "action", type: "text", required: true },
    { name: "resource", type: "text", required: true },
    { name: "record", type: "text", required: true },
  ],
}
export const ServiceSettings: CollectionConfig = {
  slug: "service-settings",
  admin: { group: "Pengaturan", useAsTitle: "name" },
  access: { create: staff, read: () => true, update: staff, delete: staff },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "baseRate",
      type: "number",
      defaultValue: 99000,
      min: 0,
      required: true,
    },
    {
      name: "videoPer5Minutes",
      type: "number",
      defaultValue: 25000,
      min: 0,
      required: true,
    },
    {
      name: "commissionPercent",
      type: "number",
      defaultValue: 20,
      min: 0,
      max: 100,
      required: true,
    },
  ],
}
export const Sales: CollectionConfig = {
  slug: "sales",
  admin: { group: "Usaha" },
  access: {
    create: member,
    read: owned,
    update: () => false,
    delete: () => false,
  },
  fields: [
    owner,
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: 50,
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          min: 1,
          max: 10000,
          required: true,
          validate: (v: number | null | undefined) =>
            Number.isInteger(v) || "Jumlah harus bilangan bulat",
        },
      ],
    },
    {
      name: "total",
      type: "number",
      access: { create: () => false, update: () => false },
    },
    {
      name: "costTotal",
      type: "number",
      access: { create: () => false, update: () => false },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        let total = 0
        let costTotal = 0
        const seen = new Set<string>()
        for (const item of data.items ?? []) {
          const id =
            typeof item.product === "object" ? item.product.id : item.product
          if (
            seen.has(String(id)) ||
            !Number.isInteger(item.quantity) ||
            item.quantity < 1
          )
            throw new Error("Produk duplikat atau jumlah tidak valid.")
          seen.add(String(id))
          const product = await req.payload.findByID({
            collection: "products",
            id,
            overrideAccess: false,
            user: req.user,
            req,
            depth: 0,
          })
          if (
            product.stock < item.quantity ||
            String(product.owner) !== String(req.user?.id)
          )
            throw new Error("Produk tidak tersedia atau stok tidak cukup.")
          await req.payload.update({
            collection: "products",
            id,
            overrideAccess: false,
            user: req.user,
            req,
            data: { stock: product.stock - item.quantity },
          })
          total += product.price * item.quantity
          costTotal += product.cost * item.quantity
        }
        if (!total) throw new Error("Keranjang kosong.")
        return { ...data, total, costTotal }
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        await req.payload.create({
          collection: "transactions",
          req,
          overrideAccess: false,
          user: req.user,
          data: {
            owner: req.user!.id,
            name: `Penjualan POS ${String(doc.id).slice(-6)}`,
            amount: doc.total,
            kind: "income",
            category: "Penjualan",
            date: new Date().toISOString(),
          },
        })
        return doc
      },
      audit,
    ],
  },
}
export const BusinessCollections = [
  Users,
  Transactions,
  Products,
  Pockets,
  Consultants,
  Slots,
  Bookings,
  AuditEvents,
  ServiceSettings,
  Sales,
]
