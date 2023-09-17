<?php

// @formatter:off
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * App\Models\Account
 *
 * @property int $id
 * @property string $name
 * @property float $total
 * @property int $hide
 * @property int $saving
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaction> $transactions
 * @property-read int|null $transactions_count
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|Account byCurrentUser()
 * @method static \Illuminate\Database\Eloquent\Builder|Account filter($request)
 * @method static \Illuminate\Database\Eloquent\Builder|Account newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Account newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Account query()
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereHide($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereSaving($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Account whereUserId($value)
 * @mixin \Eloquent
 */
	class IdeHelperAccount {}
}

namespace App\Models{
/**
 * App\Models\Budget
 *
 * @property int $id
 * @property string $plan
 * @property int $month_id
 * @property int $type 1 = expense, 2, savings
 * @property int|null $account_id
 * @property float $nominal
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property-read \App\Models\Account|null $account
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaction> $transactions
 * @property-read int|null $transactions_count
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|Budget byCurrentUser()
 * @method static \Illuminate\Database\Eloquent\Builder|Budget filter($request)
 * @method static \Illuminate\Database\Eloquent\Builder|Budget newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Budget newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Budget query()
 * @method static \Illuminate\Database\Eloquent\Builder|Budget whereAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Budget whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Budget whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Budget whereMonthId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Budget whereNominal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Budget wherePlan($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Budget whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Budget whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Budget whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Budget withDefaultFilter(?\App\Models\Filter $filter, callable $bypass)
 * @mixin \Eloquent
 */
	class IdeHelperBudget {}
}

namespace App\Models{
/**
 * App\Models\Debt
 *
 * @property int $id
 * @property int $user_id
 * @property int $account_id
 * @property string $name
 * @property string|null $description
 * @property int $amount
 * @property string $date
 * @property string $type 1: debt, 2: receivable
 * @property string $status 1: Paid, 2: Unpaid
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Account $account
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\DebtPayment> $payments
 * @property-read int|null $payments_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder|Debt byCurrentUser()
 * @method static \Illuminate\Database\Eloquent\Builder|Debt newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Debt newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Debt query()
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereUserId($value)
 * @mixin \Eloquent
 */
	class IdeHelperDebt {}
}

namespace App\Models{
/**
 * App\Models\DebtPayment
 *
 * @property int $id
 * @property int $user_id
 * @property int $debt_id
 * @property int|null $transaction_id
 * @property int $account_id
 * @property int $amount
 * @property string $date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Account $account
 * @property-read \App\Models\Debt $debt
 * @property-read \App\Models\Transaction|null $transaction
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder|DebtPayment byCurrentUser()
 * @method static \Illuminate\Database\Eloquent\Builder|DebtPayment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DebtPayment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DebtPayment query()
 * @method static \Illuminate\Database\Eloquent\Builder|DebtPayment whereAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DebtPayment whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DebtPayment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DebtPayment whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DebtPayment whereDebtId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DebtPayment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DebtPayment whereTransactionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DebtPayment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DebtPayment whereUserId($value)
 * @mixin \Eloquent
 */
	class IdeHelperDebtPayment {}
}

namespace App\Models{
/**
 * App\Models\Filter
 *
 * @property int $id
 * @property int $user_id
 * @property string $key
 * @property string $model
 * @property object $default
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Filter newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Filter newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Filter query()
 * @method static \Illuminate\Database\Eloquent\Builder|Filter whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Filter whereDefault($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Filter whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Filter whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Filter whereModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Filter whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Filter whereUserId($value)
 * @mixin \Eloquent
 */
	class IdeHelperFilter {}
}

namespace App\Models{
/**
 * App\Models\Goal
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string|null $description
 * @property string $start_date
 * @property string $target_date
 * @property string|null $reminder_per
 * @property string|null $reminder_day
 * @property string|null $reminder_time
 * @property float $nominal_target
 * @property int $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read int $less_days
 * @property-read float $presentage
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\GoalDetail> $goalDetails
 * @property-read int|null $goal_details_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder|Goal byCurrentUser()
 * @method static \Illuminate\Database\Eloquent\Builder|Goal newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Goal newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Goal query()
 * @method static \Illuminate\Database\Eloquent\Builder|Goal whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Goal whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Goal whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Goal whereNominalTarget($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Goal whereReminderDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Goal whereReminderPer($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Goal whereReminderTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Goal whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Goal whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Goal whereTargetDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Goal whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Goal whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Goal whereUserId($value)
 * @mixin \Eloquent
 */
	class IdeHelperGoal {}
}

namespace App\Models{
/**
 * App\Models\GoalDetail
 *
 * @property int $id
 * @property int $user_id
 * @property int $goal_id
 * @property string $date
 * @property float $nominal
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder|GoalDetail byCurrentUser()
 * @method static \Illuminate\Database\Eloquent\Builder|GoalDetail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GoalDetail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GoalDetail query()
 * @method static \Illuminate\Database\Eloquent\Builder|GoalDetail whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GoalDetail whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GoalDetail whereGoalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GoalDetail whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GoalDetail whereNominal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GoalDetail whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GoalDetail whereUserId($value)
 * @mixin \Eloquent
 */
	class IdeHelperGoalDetail {}
}

namespace App\Models{
/**
 * App\Models\Month
 *
 * @property int $id
 * @property string $name
 * @property string $year
 * @property int $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Budget> $budgets
 * @property-read int|null $budgets_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaction> $transactions
 * @property-read int|null $transactions_count
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|Month active()
 * @method static \Illuminate\Database\Eloquent\Builder|Month byCurrentUser()
 * @method static \Illuminate\Database\Eloquent\Builder|Month filter($request)
 * @method static \Illuminate\Database\Eloquent\Builder|Month inactive()
 * @method static \Illuminate\Database\Eloquent\Builder|Month newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Month newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Month query()
 * @method static \Illuminate\Database\Eloquent\Builder|Month whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Month whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Month whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Month whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Month whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Month whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Month whereYear($value)
 * @mixin \Eloquent
 */
	class IdeHelperMonth {}
}

namespace App\Models{
/**
 * App\Models\Profile
 *
 * @property int $id
 * @property int $user_id
 * @property string|null $address
 * @property string|null $phone
 * @property string|null $photo
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder|Profile byCurrentUser()
 * @method static \Illuminate\Database\Eloquent\Builder|Profile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Profile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Profile query()
 * @method static \Illuminate\Database\Eloquent\Builder|Profile whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Profile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Profile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Profile wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Profile wherePhoto($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Profile whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Profile whereUserId($value)
 * @mixin \Eloquent
 */
	class IdeHelperProfile {}
}

namespace App\Models{
/**
 * App\Models\Shortcut
 *
 * @property int $id
 * @property string $name
 * @property string|null $icon
 * @property string|null $url
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Shortcut newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Shortcut newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Shortcut query()
 * @method static \Illuminate\Database\Eloquent\Builder|Shortcut whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Shortcut whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Shortcut whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Shortcut whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Shortcut whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Shortcut whereUrl($value)
 * @mixin \Eloquent
 */
	class IdeHelperShortcut {}
}

namespace App\Models{
/**
 * App\Models\Transaction
 *
 * @property int $id
 * @property int $account_id
 * @property int|null $account_target
 * @property int|null $budget_id
 * @property string|null $notes
 * @property float $nominal
 * @property string $date
 * @property int $reccuring
 * @property int $type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property-read \App\Models\Account $account
 * @property-read \App\Models\Account|null $account_target_data
 * @property-read \App\Models\Budget|null $budget
 * @property-read \App\Models\DebtPayment|null $debtPayment
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction byCurrentUser()
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction filter($request)
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction query()
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction whereAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction whereAccountTarget($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction whereBudgetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction whereNominal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction whereReccuring($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Transaction whereUserId($value)
 * @mixin \Eloquent
 */
	class IdeHelperTransaction {}
}

namespace App\Models{
/**
 * App\Models\User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Debt> $debts
 * @property-read int|null $debts_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Filter> $filters
 * @property-read int|null $filters_count
 * @property-read string $joined_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Month> $months
 * @property-read int|null $months_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \App\Models\Profile|null $profile
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	class IdeHelperUser {}
}

