import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function getMyOrders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.' },
      { status: 401 }
    );
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/order/my`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      return NextResponse.json(
        { error: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Không thể tải danh sách đơn hàng.' },
      { status: res.status }
    );
  }
  return res.json();
}

export async function getMyOrder(id: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/order/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 401) {
      return {
        error: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
        status: 401,
      };
    }
    return {
      error: 'Không thể tải danh sách đơn hàng.',
      status: res.status,
    };
  }
  return res.json();
}
