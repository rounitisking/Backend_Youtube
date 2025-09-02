export class ApiError extends Error{

    constructor(status , message = "something went wrong" , errors = [] , stack = ""){

        super(message)

        this.status = status,
        this.data = null,
        this.success = false,
        this.message = message,
        this.errors = error
        
        if(stack){

            this.stack = stack
        }
        else{
            Error.captureStackTrace(this , this.constructor)
        }


    }
}

