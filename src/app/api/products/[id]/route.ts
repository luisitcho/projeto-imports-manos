import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'products.json');
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

function getProducts() {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveProducts(products: any[]) {
    fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        let { nome, preco, valor, foto, categoria } = body;

        const products = getProducts();
        const index = products.findIndex((p: any) => p.id === id);

        if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Handle Base64 Image if it's new
        if (foto && foto.startsWith('data:image')) {
            const matches = foto.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const buffer = Buffer.from(matches[2], 'base64');
                const ext = matches[1].split('/')[1] || 'webp';
                const filename = `${id}-${Date.now()}.${ext}`;
                fs.writeFileSync(path.join(uploadsDir, filename), buffer);
                foto = `/uploads/${filename}`;

                // Delete old image
                const oldFoto = products[index].foto;
                if (oldFoto && oldFoto.startsWith('/uploads/')) {
                    const oldPath = path.join(process.cwd(), 'public', oldFoto.replace('/uploads/', 'uploads/'));
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
            }
        }

        products[index] = { ...products[index], nome, preco, valor, foto, categoria };
        saveProducts(products);

        return NextResponse.json(products[index]);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        let products = getProducts();
        const product = products.find((p: any) => p.id === id);

        if (product) {
            if (product.foto && product.foto.startsWith('/uploads/')) {
                const oldPath = path.join(process.cwd(), 'public', product.foto.replace('/uploads/', 'uploads/'));
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            products = products.filter((p: any) => p.id !== id);
            saveProducts(products);
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
