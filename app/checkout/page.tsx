"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, CreditCard, ShoppingBag, Check } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/utils"
import { AnimatedText } from "@/components/ui/animated-text"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { 
  Elements, 
  CardElement,
  useStripe, 
  useElements 
} from "@stripe/react-stripe-js"
import { createPaymentIntent, processPayment, formatPaymentError } from "@/lib/payment-utils"

// Initialize Stripe with your publishable key
// This would come from your environment variables in a real app
// For now we'll use a placeholder
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

type CheckoutStep = 'information' | 'shipping' | 'payment' | 'confirmation'

// Create a separate component for the payment form to use Stripe hooks
function PaymentForm({ onSubmit, orderProcessing, totalWithShipping }: { 
  onSubmit: (e: React.FormEvent) => void,
  orderProcessing: boolean,
  totalWithShipping: number
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    if (!cardComplete) {
      setError("Please complete your card details");
      return;
    }

    setError(null);
    setProcessingPayment(true);
    
    try {
      // Step 1: Create a payment intent (would be on your backend)
      const paymentIntent = await createPaymentIntent(Math.round(totalWithShipping * 100));
      
      // Step 2: Confirm the card payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }
      
      const { error: stripeError, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              // In a real implementation, you would collect these details
              name: 'Test User',
            },
          },
        }
      );
      
      if (stripeError) {
        throw new Error(stripeError.message);
      }
      
      // Step 3: Process the payment result (would be handled by your backend)
      await processPayment({
        paymentIntentId: paymentIntent.id,
        amount: totalWithShipping,
      });
      
      // Payment successful - call the onSubmit to complete the order
      onSubmit(e);
    } catch (err) {
      setError(formatPaymentError(err));
      setProcessingPayment(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[#EDEDED] mb-4">Payment Method</h2>
          <div className="p-4 border border-[#8D9192]/20 rounded-md bg-[#252525]">
            <div className="flex items-center mb-4">
              <CreditCard className="h-6 w-6 text-[#28809a] mr-2" />
              <span className="text-[#EDEDED] font-medium">Credit Card</span>
            </div>
            
            <div>
              <Label htmlFor="card-element" className="text-[#EDEDED] mb-2 block">Card Details</Label>
              <div className="p-3 bg-[#1e1e1e] border border-[#8D9192]/30 rounded-md">
                <CardElement
                  id="card-element"
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#EDEDED',
                        '::placeholder': {
                          color: '#8D9192',
                        },
                      },
                      invalid: {
                        color: '#e63946',
                      },
                    },
                    hidePostalCode: true,
                  }}
                  onChange={(e) => setCardComplete(e.complete)}
                />
              </div>
              {error && (
                <div className="text-[#e63946] text-sm mt-2">{error}</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#2A2A2A] p-4 rounded-md border border-[#8D9192]/20">
          <h3 className="text-lg font-medium text-[#EDEDED] mb-2">Billing Address</h3>
          <div className="flex items-center mb-4">
            <input
              id="sameAsShipping"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-[#8D9192]/30 bg-[#1e1e1e] text-[#28809a] focus:ring-[#28809a]"
            />
            <label htmlFor="sameAsShipping" className="ml-2 text-[#EDEDED]">
              Same as shipping address
            </label>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="border-[#8D9192]/20 text-[#EDEDED] hover:bg-[#353535]"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Return to Shipping
          </Button>
          <Button 
            type="submit" 
            className="bg-[#28809a] hover:bg-[#28809a]/90"
            disabled={orderProcessing || processingPayment || !stripe || !elements || !cardComplete}
          >
            {orderProcessing || processingPayment ? "Processing..." : `Pay ${formatPrice(totalWithShipping)}`}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, savings, clearCart } = useCart()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information')
  const [shippingCost, setShippingCost] = useState(5.99)
  const [orderProcessing, setOrderProcessing] = useState(false)
  
  // Form states
  const [email, setEmail] = useState(user?.email || "")
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "")
  const [lastName, setLastName] = useState(user?.name?.split(" ")[1] || "")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("United States")
  const [shippingMethod, setShippingMethod] = useState("standard")

  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <main className="min-h-screen">
        <Header />
        
        <section className="relative min-h-screen py-32 flex items-center justify-center overflow-hidden">
          <div className="container max-w-4xl mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ShoppingBag className="h-24 w-24 mx-auto text-[#8D9192]/30 mb-6" />
              
              <AnimatedText
                text="Your Cart is Empty"
                el="h1"
                className="text-4xl font-bold text-[#FFFFFF] mb-4"
                animation="slide-up"
              />
              
              <p className="text-[#8D9192] text-lg max-w-lg mx-auto mb-8">
                You need to add items to your cart before proceeding to checkout.
              </p>
              
              <Link href="/products">
                <Button className="bg-[#28809a] hover:bg-[#28809a]/90 px-8 py-6 text-lg">
                  Browse Products
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    )
  }

  const handleContinueToShipping = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep('shipping')
  }

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep('payment')
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setOrderProcessing(true)
    
    // In a real app, we would save the order in your database here
    // The payment was already processed in the PaymentForm
    
    setTimeout(() => {
      setOrderProcessing(false)
      setCurrentStep('confirmation')
      clearCart()
    }, 1000)
  }

  const totalWithShipping = subtotal + shippingCost

  const renderOrderSummary = () => (
    <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg h-fit">
      <div className="p-6 border-b border-[#8D9192]/10">
        <h2 className="text-xl font-medium text-[#EDEDED]">Order Summary</h2>
      </div>
      
      <div className="px-6 pt-4 max-h-80 overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="flex gap-3 mb-4">
            <div className="w-16 h-16 relative bg-[#353535] rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#28809a] rounded-full text-xs flex items-center justify-center">
                {item.quantity}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-[#EDEDED] text-sm font-medium truncate">{item.name}</h4>
              <div className="flex items-center mt-1">
                <span className="text-[#28809a] font-medium text-sm">{formatPrice(item.price)}</span>
                {item.originalPrice && (
                  <span className="text-[#8D9192] line-through text-xs ml-2">
                    {formatPrice(item.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-6 space-y-3 border-t border-[#8D9192]/10">
        <div className="flex justify-between text-[#EDEDED]">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        {savings > 0 && (
          <div className="flex justify-between text-green-400">
            <span>Savings</span>
            <span>-{formatPrice(savings)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-[#EDEDED]">
          <span>Shipping</span>
          <span>{formatPrice(shippingCost)}</span>
        </div>
        
        <div className="flex justify-between text-[#EDEDED] font-bold pt-3 border-t border-[#8D9192]/10">
          <span>Total</span>
          <span>{formatPrice(totalWithShipping)}</span>
        </div>
      </div>
    </div>
  )

  const steps = [
    { id: 'information', label: 'Information' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
  ]

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 text-sm">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === step.id 
                ? 'bg-[#28809a] text-white' 
                : currentStep === 'confirmation' || steps.findIndex(s => s.id === currentStep) > index 
                  ? 'bg-green-500 text-white' 
                  : 'bg-[#353535] text-[#8D9192]'
            }`}
          >
            {currentStep === 'confirmation' || steps.findIndex(s => s.id === currentStep) > index ? (
              <Check className="h-4 w-4" />
            ) : (
              index + 1
            )}
          </div>
          <span className={`mx-2 ${
            currentStep === step.id ? 'text-[#EDEDED]' : 'text-[#8D9192]'
          }`}>
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div className={`w-8 h-px ${
              steps.findIndex(s => s.id === currentStep) > index 
                ? 'bg-green-500' 
                : 'bg-[#353535]'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderInformationStep = () => (
    <form onSubmit={handleContinueToShipping}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[#EDEDED] mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-[#EDEDED]">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-[#252525] border-[#8D9192]/30 text-[#EDEDED] focus:border-[#28809a]"
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#EDEDED] mb-4">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-[#EDEDED]">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 bg-[#252525] border-[#8D9192]/30 text-[#EDEDED] focus:border-[#28809a]"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-[#EDEDED]">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1 bg-[#252525] border-[#8D9192]/30 text-[#EDEDED] focus:border-[#28809a]"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address" className="text-[#EDEDED]">Address</Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="mt-1 bg-[#252525] border-[#8D9192]/30 text-[#EDEDED] focus:border-[#28809a]"
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-[#EDEDED]">City</Label>
              <Input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="mt-1 bg-[#252525] border-[#8D9192]/30 text-[#EDEDED] focus:border-[#28809a]"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-[#EDEDED]">State / Province</Label>
              <Input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="mt-1 bg-[#252525] border-[#8D9192]/30 text-[#EDEDED] focus:border-[#28809a]"
              />
            </div>
            <div>
              <Label htmlFor="zipCode" className="text-[#EDEDED]">ZIP / Postal Code</Label>
              <Input
                id="zipCode"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
                className="mt-1 bg-[#252525] border-[#8D9192]/30 text-[#EDEDED] focus:border-[#28809a]"
              />
            </div>
            <div>
              <Label htmlFor="country" className="text-[#EDEDED]">Country</Label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full mt-1 bg-[#252525] border border-[#8D9192]/30 rounded-md px-3 py-2 text-[#EDEDED] focus:outline-none focus:border-[#28809a]"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Link href="/cart">
            <Button type="button" variant="outline" className="border-[#8D9192]/20 text-[#EDEDED] hover:bg-[#353535]">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Return to Cart
            </Button>
          </Link>
          <Button type="submit" className="bg-[#28809a] hover:bg-[#28809a]/90">
            Continue to Shipping
          </Button>
        </div>
      </div>
    </form>
  )

  const renderShippingStep = () => (
    <form onSubmit={handleContinueToPayment}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[#EDEDED] mb-4">Shipping Method</h2>
          <div className="space-y-3">
            <div className="flex items-center p-4 border border-[#8D9192]/20 rounded-md bg-[#252525]">
              <input
                id="standard"
                type="radio"
                name="shipping"
                value="standard"
                checked={shippingMethod === "standard"}
                onChange={() => {
                  setShippingMethod("standard")
                  setShippingCost(5.99)
                }}
                className="h-4 w-4 text-[#28809a] focus:ring-[#28809a]"
              />
              <label htmlFor="standard" className="ml-3 flex flex-1 justify-between items-center">
                <span className="text-[#EDEDED]">Standard Shipping (3-5 business days)</span>
                <span className="text-[#28809a] font-medium">{formatPrice(5.99)}</span>
              </label>
            </div>
            
            <div className="flex items-center p-4 border border-[#8D9192]/20 rounded-md bg-[#252525]">
              <input
                id="express"
                type="radio"
                name="shipping"
                value="express"
                checked={shippingMethod === "express"}
                onChange={() => {
                  setShippingMethod("express")
                  setShippingCost(14.99)
                }}
                className="h-4 w-4 text-[#28809a] focus:ring-[#28809a]"
              />
              <label htmlFor="express" className="ml-3 flex flex-1 justify-between items-center">
                <span className="text-[#EDEDED]">Express Shipping (1-2 business days)</span>
                <span className="text-[#28809a] font-medium">{formatPrice(14.99)}</span>
              </label>
            </div>
            
            <div className="flex items-center p-4 border border-[#8D9192]/20 rounded-md bg-[#252525]">
              <input
                id="overnight"
                type="radio"
                name="shipping"
                value="overnight"
                checked={shippingMethod === "overnight"}
                onChange={() => {
                  setShippingMethod("overnight")
                  setShippingCost(24.99)
                }}
                className="h-4 w-4 text-[#28809a] focus:ring-[#28809a]"
              />
              <label htmlFor="overnight" className="ml-3 flex flex-1 justify-between items-center">
                <span className="text-[#EDEDED]">Overnight Shipping (next business day)</span>
                <span className="text-[#28809a] font-medium">{formatPrice(24.99)}</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="border-[#8D9192]/20 text-[#EDEDED] hover:bg-[#353535]"
            onClick={() => setCurrentStep('information')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Return to Information
          </Button>
          <Button type="submit" className="bg-[#28809a] hover:bg-[#28809a]/90">
            Continue to Payment
          </Button>
        </div>
      </div>
    </form>
  )

  const renderPaymentStep = () => (
    <Elements stripe={stripePromise}>
      <PaymentForm 
        onSubmit={handleSubmitOrder} 
        orderProcessing={orderProcessing}
        totalWithShipping={totalWithShipping}
      />
    </Elements>
  )

  const renderConfirmationStep = () => (
    <div className="text-center py-6">
      <motion.div
        className="flex justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="h-12 w-12 text-white" />
        </div>
      </motion.div>
      
      <AnimatedText
        text="Order Confirmed!"
        el="h1"
        className="text-3xl font-bold text-[#FFFFFF] mb-4"
        animation="slide-up"
      />
      
      <p className="text-[#8D9192] text-lg max-w-lg mx-auto mb-4">
        Thank you for your purchase. Your order has been received and is being processed.
      </p>

      <div className="bg-[#2A2A2A] rounded-md p-4 max-w-sm mx-auto mb-8 text-left">
        <h3 className="text-lg font-medium text-[#EDEDED] mb-2">Order Details</h3>
        <div className="text-[#8D9192]">
          <p><span className="text-[#EDEDED]">Order Number:</span> #ORD-{Date.now().toString().slice(-8)}</p>
          <p><span className="text-[#EDEDED]">Email:</span> {email}</p>
          <p><span className="text-[#EDEDED]">Shipping Method:</span> {
            shippingMethod === 'standard' 
              ? 'Standard Shipping (3-5 business days)' 
              : shippingMethod === 'express' 
                ? 'Express Shipping (1-2 business days)' 
                : 'Overnight Shipping (next business day)'
          }</p>
          <p><span className="text-[#EDEDED]">Total:</span> {formatPrice(totalWithShipping)}</p>
        </div>
      </div>
      
      <p className="text-[#8D9192] mb-8">
        A confirmation email has been sent to <span className="text-[#EDEDED]">{email}</span>
      </p>
      
      <Link href="/">
        <Button className="bg-[#28809a] hover:bg-[#28809a]/90 px-8 py-6 text-lg">
          Continue Shopping
        </Button>
      </Link>
    </div>
  )

  return (
    <main className="min-h-screen">
      <Header />
      
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#28809a]/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#28809a]/10 blur-3xl" />
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#FFFFFF]">
              {currentStep === 'confirmation' ? 'Thank You!' : 'Checkout'}
            </h1>
          </div>

          {currentStep !== 'confirmation' && renderStepIndicator()}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-6">
              {currentStep === 'information' && renderInformationStep()}
              {currentStep === 'shipping' && renderShippingStep()}
              {currentStep === 'payment' && renderPaymentStep()}
              {currentStep === 'confirmation' && renderConfirmationStep()}
            </div>
            
            {currentStep !== 'confirmation' && (
              <div className="lg:col-span-1">
                {renderOrderSummary()}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
} 