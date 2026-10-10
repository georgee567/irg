# IRG Admin Product Guide

## Access

Open `/admin/products` while signed in as an ADMIN user. In local development, use `admin@irg.com` / `password` after running the seed. Customers receive an admin access error and cannot use the admin API.

## Add a product

1. Open `/admin/products` and select **Add New Product**.
2. Enter the name, unique slug, description, price in KES, category, and variants.
3. Add each size/color combination with its variant price and stock quantity.
4. Upload one or more product images, then select **Create product**. The product appears in the homepage collection and the shop.

## Add a product image

1. In the **Product images** section, select the image file from your computer.
2. Use JPEG, PNG, WebP, or AVIF images up to 5 MB each.
3. Wait for the uploaded image preview before saving. Uploaded files are stored in Vercel Blob and remain available in production.

## Edit products

Select **Edit** in the product table to change the name, description, price, category, slug, images, variants, or stock. Select **Save changes**; the existing product is updated and its variants are replaced in one transaction.

## Featured, stock, and deletion

- All products appear in the homepage collection, newest first.
- Change the `stock` value on the relevant size/color variant and save.
- Select **Delete**, then confirm. Products already referenced by an order are protected from deletion.

## Edit public website content

1. Sign in with an ADMIN account and open **Site Content** in the admin navigation (`/admin/content`).
2. Choose Home, About, Contact, Journal, Lookbook, Custom, Footer, or Header and edit the fields shown.
3. To replace an image or add a video, upload it in the media panel, copy its URL, and paste that URL into the matching image, video, or media URL field. The home hero supports both an image and an optional video; About, Contact, Journal, Lookbook, and Custom pages also have optional media fields.
4. Select **Save Changes** to publish the selected page's content. Select **Load Defaults** and save to restore the original text and assets.

Content is stored in the site database. Media uploads use Vercel Blob and support JPEG, PNG, WebP, AVIF, MP4, WebM, and MOV files up to 100 MB.

The build command applies checked-in Prisma migrations to the database configured for that deployment before building the app. Confirm the `DATABASE_URL` deployment setting points to the intended environment; the local development database and Vercel production database are separate.
