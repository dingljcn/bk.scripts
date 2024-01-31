Date.prototype.$setMinute = function(num: number): Date {
    this.setMinutes(this.getMinutes() + num);
    return this;
}

Date.prototype.$setHour = function(num: number): Date {
    this.setHours(this.getHours() + num);
    return this;
}

Date.prototype.$setDate = function(num: number): Date {
    this.setDate(this.getDate() + num);
    return this;
}

Date.prototype.$setMonth = function(num: number): Date {
    this.setMonth(this.getMonth() + num);
    return this;
}

Date.prototype.$setYear = function(num: number): Date {
    this.setYear(this.getYear() + num);
    return this;
}

Date.prototype.$format = function(format: string = 'yyyy-MM-dd HH:mm:ss'): string {
    return format
        .replace(/yyyy/, `${ this.getFullYear() }`)
        .replace(/yy/, `${ this.getFullYear() % 100 }`)
        .replace(/MM/, this.getMonth() + 1 > 9 ? this.getMonth() + 1 : `0${ this.getMonth() + 1 }`)
        .replace(/dd/, this.getDate() > 9 ? this.getDate() : `0${ this.getDate() }`)
        .replace(/HH/, this.getHours() > 9 ? this.getHours() : `0${ this.getHours() }`)
        .replace(/mm/, this.getMinutes() > 9 ? this.getMinutes() : `0${ this.getMinutes() }`)
        .replace(/ss/, this.getSeconds() > 9 ? this.getSeconds() : `0${ this.getSeconds() }`)
}