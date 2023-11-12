import React, { useCallback } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { loginSchema } from '@/utils/yupValidator';
import { message } from 'antd';


type FormData = yup.InferType<typeof loginSchema>;
const MESSAGE_TYPE = {
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
};
const Login = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const { login } = useAuth();
    const [error, setError] = React.useState<string | null>(null);
    const onShowMessage = useCallback(
        (content: string, type = MESSAGE_TYPE.SUCCESS) => {
            messageApi.open({
                type: type,
                content: content,
            });
        },
        [messageApi],
    );
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: yupResolver(loginSchema),
    });
    const onSubmit = async (data: FormData) => {
        console.log(data);
        const result = await login(data.email, data.password);
        console.log(result);
        if (result.isAuthenticated) {
            navigate("/customers");
        } else {
            setError(result.error);
        }
    };

    return (
        <div className='max-w-[300px] mx-auto min-w-[300px]'>
            <h2 className='text-2xl text-center mb-3 font-bold'>Login Form</h2>
            {error && <div>Error: {error}</div>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <input placeholder="Email" {...register("email")} />
                <p>{errors.email?.message}</p>

                <input placeholder="password" {...register("password")} />
                <p>{errors.password?.message}</p>

                <button className='block w-full' disabled={isSubmitting} type="submit">
                    {isSubmitting ? 'Submitting...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
