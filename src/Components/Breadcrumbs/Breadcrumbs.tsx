import React from 'react';
import { Breadcrumb } from 'antd';

const pathnameMap = new Map([
    ['main', 'Главная'],
    ['calendar', 'Календарь'],
    ['journal', 'Журнал']
]);

// Хлебные крошки в области контента
export const Breadcrumbs: React.FC = () => {
    const stepStrings: string[] = window.location.pathname.split('/');

    const steps = stepStrings.reduce((result: { title: string | undefined }[], key: string, index: number) => {
        if (key) {
            // Если в адресе содержится только 'main', то по-умолчанию добавить 'Календарь'
            if (!stepStrings[index - 1] && key === 'main' && !stepStrings[index + 1]) {
                return [
                    ...result,
                    { title: pathnameMap.get(key) },
                    { title: 'Календарь' }
                ];
            }

            return [...result, { title: pathnameMap.get(key) }];
        }
        return result;
    }, []);

    return (
        <Breadcrumb style={{ margin: '16px 0' }} items={steps} />
    );
};