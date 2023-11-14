package dto

type MiniAppInitData struct {
	InitData string `json:"init_data"`
}

type WebAppInitData struct {
	QueryId      string     `json:"query_id"`
	User         WebAppUser `json:"user"`
	Receiver     WebAppUser `json:"receiver"`
	Chat         WebAppChat `json:"chat"`
	ChatType     string     `json:"chat_type"`
	ChatInstance string     `json:"chat_instance"`
	StartParam   string     `json:"start_param"`
	CanSendAfter uint64     `json:"can_send_after"`
	AuthDate     string     `json:"auth_date"`
	Hash         string     `json:"hash"`
}

type WebAppUser struct {
	Id                    uint64 `json:"id"`
	IsBot                 bool   `json:"is_bot"`
	FirstName             string `json:"first_name"`
	LastName              string `json:"last_name"`
	UserName              string `json:"username"`
	LanguageCode          string `json:"language_code"`
	IsPremium             bool   `json:"is_premium"`
	AddedToAttachmentMenu bool   `json:"added_to_attachment_menu"`
	AllowsWriteToPm       bool   `json:"allows_write_to_pm"`
	PhotoUrl              string `json:"photo_url"`
}

type WebAppChat struct {
	Id       uint64 `json:"id"`
	Type     string `json:"type"`
	Title    string `json:"title"`
	UserName string `json:"username"`
	PhotoUrl string `json:"photo_url"`
}
