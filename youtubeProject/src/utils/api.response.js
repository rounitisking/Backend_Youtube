

export class ApiResponse{

    constructor(status , data , message = "res send successfully" , success = true){

        this.status = status,
        this.message = message,
        this.data = data,
        this.success = status < 400
    }
}

