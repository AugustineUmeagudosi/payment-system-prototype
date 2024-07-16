import Link from 'next/link'
import React from 'react'

export const ForgotPassword = () => {
  return (
    <div className='grid place-items-center h-screen'>
        <div className='shadow-lg p-5 rounded-lg border-t-4 border-green-400'>
            <h1 className='text-xl font-bold my-4'>Reset Password</h1>

            <form className='flex flex-col gap-3'>
                <input type="text" placeholder='Email' />
                <button className='bg-green-600 text-white font-bold cursor-pointer px-6 py-2'>Send Reset Password Link</button>
                <div className="bg-red-400 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">Error message</div>

                <Link href={'/register'} className='text-sm mt-3 text-right'>
                    Don&apos;t have an account? <span className='underline'>Register</span>
                </Link>
            </form>
        </div>
    </div>
  )
}
