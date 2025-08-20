import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-error/10 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="w-10 h-10 text-error" />
        </div>
        
        <h2 className="text-2xl font-display font-bold text-primary mb-4">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>
        
        <div className="space-y-4">
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/"}
            className="w-full"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">
            If this problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Error