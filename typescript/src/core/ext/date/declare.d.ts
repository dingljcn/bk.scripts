declare global {
    interface Date {
        /** 在当前分钟上做偏移 */
        $setMinute(num: number): Date;
        /** 在当前小时上做偏移 */
        $setHour(num: number): Date;
        /** 在当前日期上做偏移 */
        $setDate(num: number): Date;
        /** 在当前月份上做偏移 */
        $setMonth(num: number): Date;
        /** 在当前年份上做偏移 */
        $setYear(num: number): Date;
        /** 格式化当前日期 */
        $format(): string;
        $format(format: string): string;
    }
}

export {};